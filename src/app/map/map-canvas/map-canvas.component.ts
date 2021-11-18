import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationMapElement } from 'src/helpers';
import { MapMode, Point, MapDragItem, MapItemStatus, FlowMapElement, StationElementHoverType, ConnectionLineInfo } from 'src/models';
import { ConnectionElementService } from '../connection-element.service';
import { BADGE_MARGIN, BADGE_RADIUS,
  BUTTON_RADIUS, BUTTON_Y_MARGIN, CONNECTION_DEFAULT_COLOR, CONNECTION_LINE_WIDTH, CONNECTION_LINE_WIDTH_ZOOM_OUT, DEFAULT_MOUSE_POINT,
  DEFAULT_SCALE, MAX_SCALE, MIN_SCALE, SCALE_REDUCED_RENDER, SCALE_RENDER_STATION_ELEMENTS,
  STATION_HEIGHT, STATION_WIDTH, ZOOM_VELOCITY } from '../map-constants';
import { MapService } from '../map.service';
import { StationElementService } from '../station-element.service';
import { FlowElementService } from '../flow-element.service';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for the main `<canvas>` element used for the map.
 */
@Component({
  selector: 'app-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss']
})
export class MapCanvasComponent implements OnInit, OnDestroy {
  /** Reference to the main canvas element used for the map. */
  @ViewChild('map', { static: true }) private mapCanvas!: ElementRef<HTMLCanvasElement>;

  /** Subject for whether the component was destroyed. */
  private destroyed$ = new Subject<void>();

  /** The rendering context for the canvas element for the map. */
  private context!: CanvasRenderingContext2D;

  /** Modes for canvas element used for the map. */
  mapMode = MapMode.View;

  /** The coordinate at which the canvas is currently rendering in regards to the overall map. */
  currentCanvasPoint: Point = { x: 0, y: 0 };

  /** The coordinate where the mouse or touch event begins. */
  private eventStartCoords: Point = DEFAULT_MOUSE_POINT;

  /** Used to track map movement on a touchscreen. */
  private lastTouchCoords: Point[] = [DEFAULT_MOUSE_POINT];

  /** Used to track number of touches. Needed to handle multi-touch interactions with pointer events.*/
  private pointerCache: PointerEvent[] = [];

  /** What type of thing is being dragged? */
  private dragItem = MapDragItem.Default;

  /** Data for station card used in the map. */
  stations: StationMapElement[] = [];

  /** Data for flow used in the map. */
  flows: FlowMapElement[] = [];

  /** Scale to calculate canvas points. */
  private scale = DEFAULT_SCALE;

  /**Track zoomCount. */
  private zoomCount = 0;

  /**Set up interval for zoom. */
  private zoomInterval?: NodeJS.Timeout;

  /** Connection line path between stations. */
  lineItems = Array<ConnectionLineInfo>();

  /**
   * Add station mode active.
   *
   * @returns Boolean.
   */
  get stationAddActive(): boolean {
    return this.mapMode === MapMode.StationAdd;
  }

  constructor(
    private mapService: MapService,
    private stationElementService: StationElementService,
    private connectionElementService: ConnectionElementService,
    private flowElementService: FlowElementService,
    private dialog: MatDialog
  ) {
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mapMode) => {
        this.mapMode = mapMode;
        this.drawElements();
      });

    this.mapService.mapScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale) => {
        this.scale = scale;
        this.scaleChangeDraw();
      });

    this.mapService.currentCanvasPoint$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((point) => {
        this.currentCanvasPoint = point;
        this.drawElements();
      });

    this.mapService.mapDataReceived$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.stations = this.mapService.stationElements.filter((e) => e.status !== MapItemStatus.Deleted);
        this.flows = this.mapService.flowElements;
        this.drawElements();
      });

    this.mapService.zoomCount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((count) => {
        this.zoomCount = count;
      });
  }

  /**
   * Scales the canvas and does initial draw for elements.
   */
  ngOnInit(): void {
    this.context = this.mapCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.mapService.registerCanvasContext(this.context);
    this.setCanvasSize();
    this.drawElements();
  }

  /**
   * Cleans up subscription.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Responds to changing window size by setting a new canvas size and re-drawing the elements.
   */
  @HostListener('window:resize', ['$event'])
  windowResize(): void {
    this.setCanvasSize();
    this.drawElements();
  }

  /**
   * Handles user input when pressing down and a pointer event is fired.
   *
   * @param event The pointerdown event that was triggered.
   */
  @HostListener('pointerdown', ['$event'])
  pointerDown(event: PointerEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    if (window.PointerEvent && !(is_android && is_firefox)) {
        event.preventDefault();
        //If event exists in pointerCache, update event in cache.
        for (let i = 0; i < this.pointerCache.length; i++) {
          if (this.pointerCache[i].pointerId === event.pointerId) {
            this.pointerCache.splice(i, 1, event);
            break;
          }
        }

        //If event doesn't exist in pointerCache, add it.
        if (!this.pointerCache.includes(event)) {
          this.pointerCache.push(event);
        }

        if (this.pointerCache.length === 1) {
          const pointer = this.pointerCache[0];
          this.lastTouchCoords[0] = this.getEventCanvasPoint(pointer);
          this.eventStartCoords = this.getEventCanvasPoint(pointer);

          const pointerPos = this.getEventCanvasPoint(pointer);
          this.eventStartLogic(pointerPos);
        }

        if (this.pointerCache.length === 2) {
          const pointer1 = this.pointerCache[0];
          const pointer2 = this.pointerCache[1];

          this.lastTouchCoords = [this.getEventCanvasPoint(pointer1), this.getEventCanvasPoint(pointer2)];
          this.eventStartCoords = this.getEventCanvasPoint(pointer1);
        }

        if (this.dragItem !== MapDragItem.Default) {
          const map = document.getElementById('map');
          map?.setPointerCapture(event.pointerId);
        }
      }
    }

  /**
   * Handles user input when releasing and a pointer event is fired.
   *
   * @param event The mouseup event that was triggered.
   */
  @HostListener('pointerup', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pointerUp(event: PointerEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    if (window.PointerEvent && !(is_android && is_firefox)) {
      event.preventDefault();

      //remove event from cache.
      for (let i = 0; i < this.pointerCache.length; i++) {
        if (this.pointerCache[i].pointerId === event.pointerId) {
          this.pointerCache.splice(i, 1);
          break;
        }
      }

      if (this.pointerCache.length === 0) {
        const pointerPos = this.getEventCanvasPoint(event);

        if (this.dragItem !== MapDragItem.Default) {
          const map = document.getElementById('map');
          map?.releasePointerCapture(event.pointerId);
        }

        this.eventEndLogic(pointerPos);
        this.openConnectionDrawer(event);
      } else {
        const pointer = this.pointerCache[0];
        this.lastTouchCoords[0] = this.getEventCanvasPoint(pointer);
      }
    }
  }

  /**
   * Handles user input when a pointer is moved. Used for calculating dragging and hover status.
   *
   * @param event The pointermove event that was triggered.
   */
  @HostListener('pointermove', ['$event'])
  pointerMove(event: PointerEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    if (window.PointerEvent && !(is_android && is_firefox)) {
      event.preventDefault();

      //If event exists in pointerCache, update event in cache.
      for (let i = 0; i < this.pointerCache.length; i++) {
        if (this.pointerCache[i].pointerId === event.pointerId) {
          this.pointerCache.splice(i, 1, event);
          break;
        }
      }

      //If event doesn't exist in pointerCache, add it.
      if (!this.pointerCache.includes(event)) {
        this.pointerCache.push(event);
      }

      if (this.pointerCache.length === 1) {
        const pointer = this.pointerCache[0];
        const touchPos = this.getEventCanvasPoint(pointer);
        //this method has better compatibility with different input types than singleInputMouseMoveLogic.
        this.singleInputMoveLogic(touchPos);
      }

      // Pinch event.
      if (this.pointerCache.length === 2) {
        const pointer1 = this.pointerCache[0];
        const pointer2 = this.pointerCache[1];

        const pointerPos = [this.getEventCanvasPoint(pointer1), this.getEventCanvasPoint(pointer2)];
        this.pinchZoomLogic(pointerPos);
      }
    }
  }

  /**
   * Handles user input when a mouse button is pressed. Used for initiating dragging.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The mousedown event that was triggered.
   */
  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent): void {
    if (!window.PointerEvent) {
      this.eventStartCoords = this.getEventCanvasPoint(event);
      this.lastTouchCoords[0] = this.getEventCanvasPoint(event);
      this.eventStartCoords = this.getEventCanvasPoint(event);

      const mousePos = this.getEventCanvasPoint(event);
      this.eventStartLogic(mousePos);
    }
  }

  /**
   * Handles user input when a mouse button is released. Used for placing dragged elements.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The mouseup event that was triggered.
   */
  @HostListener('mouseup', ['$event'])
  mouseUp(event: MouseEvent): void {
    if (!window.PointerEvent) {
      const mousePos = this.getEventCanvasPoint(event);
      this.lastTouchCoords[0] = this.getEventCanvasPoint(event);

      this.eventEndLogic(mousePos);
    }
  }

  /**
   * Handles user input when a mouse cursor is moved. Used for calculating dragged element movement, or map pan drag.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The mousemove event that was triggered.
   */
  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {
    if (!window.PointerEvent) {
      const pos = this.getEventCanvasPoint(event);
      this.singleInputMoveLogic(pos);
    }
    const mousePos = this.getEventContextPoint(event);

    for (const connectionLine of this.lineItems) {
      if (this.context.isPointInStroke(connectionLine.path, mousePos.x, mousePos.y)) {
        this.context.strokeStyle = '#00ff00';
        this.mapCanvas.nativeElement.style.cursor = 'pointer';
      } else {
        this.context.strokeStyle = CONNECTION_DEFAULT_COLOR;
        this.mapCanvas.nativeElement.style.cursor = 'default';
      }
      this.context.lineWidth = this.scale > SCALE_REDUCED_RENDER ? CONNECTION_LINE_WIDTH : CONNECTION_LINE_WIDTH_ZOOM_OUT;
      this.context.stroke(connectionLine.path);
    }
  }

  /**
   * Handles input when a user presses a touchscreen. Used for initiating dragging.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The touchstart event that was triggered.
   */
  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    if (!window.PointerEvent || (is_android && is_firefox)) {
      if (event.touches.length === 1) {
        const touchPoint = event.touches[0];
        const touchPos = this.getEventCanvasPoint(touchPoint);

        this.lastTouchCoords[0] = touchPos;
        this.eventStartCoords = touchPos;

        this.eventStartLogic(touchPos);
      }

      if (event.touches.length === 2) {
        const touchPoint1 = event.touches[0];
        const touchPoint2 = event.touches[1];

        this.lastTouchCoords = [this.getEventCanvasPoint(touchPoint1), this.getEventCanvasPoint(touchPoint2)];
        this.eventStartCoords = this.getEventCanvasPoint(touchPoint1);
      }
    }
  }


  /**
   * Handles user input when a user lifts their finger. Used for placing dragged elements.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The touchend event that was triggered.
   */
  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    if (!window.PointerEvent || (is_android && is_firefox)) {
      const touchPoint = event.changedTouches[0];
      const touchPos = this.getEventCanvasPoint(touchPoint);

      this.eventEndLogic(touchPos);
    }
  }

  /**
   * Handles input when a user drags their finger across the screen. Used for calculating dragged element movement, or map pan drag.
   * --DEPRECIATED-- Maintained for backwards compatibility.
   *
   * @param event The touchmove event that was triggered.
   */
  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android = navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    if (!window.PointerEvent || (is_android && is_firefox)) {
      //Single touch.
      if (event.touches.length === 1) {
        const touchPoint = event.changedTouches[0];
        const touchPos = this.getEventCanvasPoint(touchPoint);

        this.singleInputMoveLogic(touchPos);
      }

      //Pinch event.
      if (event.touches.length === 2) {
        const touchPoint = event.changedTouches;
        const touchPos = [this.getEventCanvasPoint(touchPoint[0]), this.getEventCanvasPoint(touchPoint[1])];

        this.pinchZoomLogic(touchPos);
      }
    }
  }

  /**
   * Handles user input when a mouse button is right clicked. Used for bringing up the right click menu.
   *
   * @param event The contextmenu event that was triggered.
   */
  @HostListener('contextmenu', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contextMenu(event: MouseEvent): void {
    // TODO: Handle behavior when mouse is right clicked
  }

  /**
   * Handles user input when a keyboard key is pressed. Used for keyboard shortcuts.
   *
   * @param event The keydown event that was triggered.
   */
  @HostListener('keydown', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyDown(event: KeyboardEvent): void {
    // TODO: Handle behavior when key is pressed
  }

  /**
   * Handles user input when a mouse wheel is scrolled. Used for zoom.
   *
   * @param event The wheel event that was triggered.
   */
  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent): void {
    event.preventDefault();
    const mousePoint = this.getEventCanvasPoint(event);
    const eventAmount = event.deltaY >= 100
    ? Math.floor(event.deltaY/100)
    : event.deltaY <= -100
      ? Math.ceil(event.deltaY/100)
      : event.deltaY/3;

    if (event.deltaY < 0) {
      // Do nothing if already at max zoom.
      if (this.scale >= MAX_SCALE) {
        this.mapService.zoomCount$.next(0);
        return;
      }
      // Zoom in
      if (this.zoomCount < 0) {
        this.mapService.zoomCount$.next(0);
      }
      this.mapService.zoomCount$.next(this.zoomCount + Math.floor(10*-eventAmount));
      this.mapService.handleZoom(mousePoint, false);
    } else {
      // Do nothing if already at min zoom.
      if (this.scale <= MIN_SCALE
        || this.mapService.mapMode$.value !== MapMode.View
        && this.scale <= SCALE_RENDER_STATION_ELEMENTS/ZOOM_VELOCITY) {
          this.mapService.zoomCount$.next(0);
          return;
        }
      // Zoom out
      if (this.zoomCount > 0) {
        this.mapService.zoomCount$.next(0);
      }
      this.mapService.zoomCount$.next(this.zoomCount - Math.floor(10*eventAmount));
      this.mapService.handleZoom(mousePoint, false);
    }
    // Overlay option menu close state.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }
  }

  /**
   * Animates at a set framerate when scale is changed.
   *
   * @param fps The framerate to animate at.
   */
  private scaleChangeDraw(fps = 60): void {
    if (this.zoomCount !== 0){
      if (!this.zoomInterval) {
        this.zoomInterval = setInterval(() => {
          if (this.zoomCount === 0 && this.zoomInterval) {
            clearInterval(this.zoomInterval);
            this.zoomInterval = undefined;
          }
          this.drawElements();
        }, 1000/ fps);
      }
    }
  }

  /**
   * Draws all the elements on the canvas.
   */
  private drawElements(): void {
    requestAnimationFrame(() => {
      const pixelRatio = window.devicePixelRatio || 1;
      // Clear the canvas
      this.context.clearRect(0, 0, this.mapCanvas.nativeElement.width / pixelRatio, this.mapCanvas.nativeElement.height / pixelRatio);

      // Calculate the station canvas points
      this.stations.forEach((station) => {
        station.canvasPoint = this.mapService.getCanvasPoint(station.mapPoint);
      });
      // Draw the flows
      this.flowElementService.drawFlow(this.stations);

      // Draw the connections
      this.lineItems.length = 0;
      for (const station of this.stations) {
        for (const connection of station.nextStations) {
          const outgoingStation = this.stations.find((foundStation) => foundStation.rithmId === connection) as StationMapElement;
          const startPoint = {
            x: station.canvasPoint.x + STATION_WIDTH * this.scale,
            y: station.canvasPoint.y + STATION_HEIGHT * this.scale / 2
          };
          const endPoint = {
            x: outgoingStation?.canvasPoint.x,
            y: outgoingStation?.canvasPoint.y + STATION_HEIGHT * this.scale / 2
          };

          const path = this.connectionElementService.getConnectionLine(startPoint, endPoint);

          const lineInfo: ConnectionLineInfo = {connectionStartStationName: station.stationName,
            connectionEndStationName: outgoingStation.stationName, connectionStartStationRithmId: station.rithmId,
           connectionEndStationRithmId: outgoingStation.rithmId, path: path };

          this.lineItems.push(lineInfo);
          const ctx = this.context;

          // Draw connection line
          ctx.setLineDash([0, 0]);

          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineWidth = this.scale > SCALE_REDUCED_RENDER ? CONNECTION_LINE_WIDTH : CONNECTION_LINE_WIDTH_ZOOM_OUT;
          ctx.strokeStyle = CONNECTION_DEFAULT_COLOR;
          ctx.stroke(path);
        }
      }

      // Draw the stations
      this.stations.forEach((station) => {
        this.stationElementService.drawStation(station, this.mapMode, this.mapService.currentMousePoint$.value, this.dragItem);
      });

    });
  }

  /**
   * Sets an accurate canvas size based on the viewport and scales the canvas for accurate display on HiDPI/Retina displays.
   */
  private setCanvasSize(): void {
    //Sets height using a css variable. this allows us to avoid using vh. Mobile friendly.
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--canvasvh', `${vh}px`);

    const pixelRatio = window.devicePixelRatio || 1;
    const canvasBoundingRect = this.mapCanvas.nativeElement.getBoundingClientRect();

    this.mapCanvas.nativeElement.width = canvasBoundingRect.width * pixelRatio;
    this.mapCanvas.nativeElement.height = canvasBoundingRect.height * pixelRatio;
    this.context.scale(pixelRatio, pixelRatio);
  }

  /**
   * Determines the point on the canvas that the mouse cursor/pointer or touch event is positioned.
   *
   * @param event The event for the cursor or touch information.
   * @returns An accurate point for the cursor or touch position on the canvas.
   */
  private getEventCanvasPoint(event: MouseEvent | PointerEvent | Touch | PointerEvent): Point {
    const canvasRect = this.mapCanvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
  }

  /**
   * Determines the point on the canvas context that the mouse cursor/pointer or touch event is positioned. This adjusts for the pixel
   * ratio in order to report an accurate position when using `context` methods like `isPointInPath` or `isPointInStroke`.
   *
   * @param event The event for the cursor or touch information.
   * @returns An accurate point for the cursor or touch position on the canvas context.
   */
   private getEventContextPoint(event: MouseEvent | PointerEvent | Touch | PointerEvent): Point {
    const canvasPoint = this.getEventCanvasPoint(event);
    return {
      x: canvasPoint.x * window.devicePixelRatio,
      y: canvasPoint.y * window.devicePixelRatio
    };
  }

  /**
   * Handles mouseDown and touchStart logic.
   *
   * @param position The position of the mouse or touch event.
   */
  private eventStartLogic(position: Point) {
    // Overlay option menu close state.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }
    if (this.mapMode === MapMode.Build) {
      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(position, this.scale);
        // clicked on a connection node.
        if (station.hoverActive === StationElementHoverType.Node) {
          station.dragging = true;
          this.dragItem = MapDragItem.Node;
          break;
        // Check for drag start on station
        } else if (station.hoverActive !== StationElementHoverType.None) {
          station.dragging = true;
          if (this.dragItem !== MapDragItem.Node) {
            this.dragItem = MapDragItem.Station;
          }
          break;
        }
      }
      //This ensures that when dragging a station or node connection, it will always display above other stations.
      if (this.stations.find( obj => obj.dragging === true)) {
        const draggingStation = this.stations.filter( obj => obj.dragging === true);
        this.stations = this.stations.filter( obj => obj.dragging !== true);
        this.stations.push(draggingStation[0]);
      }
    }

    if (this.dragItem !== MapDragItem.Station && this.dragItem !== MapDragItem.Node) {
      // Assume map for now
      this.dragItem = MapDragItem.Map;
    }
  }

  /**
   * Handles mouseUp and touchEnd logic.
   *
   * @param position The position of the mouse or touch event.
   */
  private eventEndLogic(position: Point) {
    // Overlay option menu close state.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }
    //If it is a click and not a drag.
    if (Math.abs(position.x - this.eventStartCoords.x) < 5 && Math.abs(position.y - this.eventStartCoords.y) < 5) {
      if (this.mapMode === MapMode.StationAdd) {
        const coords: Point = { x: 0, y: 0 };
        coords.x = position.x - STATION_WIDTH / 2 * this.scale;
        coords.y = position.y - STATION_HEIGHT / 2 * this.scale;

        //create a new station at click.
        this.mapService.createNewStation(coords);

        //After clicking, set to build mode.
        this.mapService.mapMode$.next(MapMode.Build);
      }

      //Check if click was over document badge.
      this.clickEventHandler(position);

    }

    //If dragging a connection node.
    if (this.dragItem === MapDragItem.Node) {
      let newNextStationId = '';
      let newPreviousStationId = '';
      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(position, this.scale);
        if (station.hoverActive !== StationElementHoverType.None) {
          newNextStationId = station.rithmId;
        }
        if (station.dragging) {
          newPreviousStationId = station.rithmId;
        }
      }

      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(position, this.scale);
        if (station.hoverActive === StationElementHoverType.Station) {
          //ensure we cant get duplicate ids.
          if (!station.previousStations.includes(newPreviousStationId) && station.rithmId !== newPreviousStationId) {
            if (newPreviousStationId.length > 0 && newNextStationId.length > 0) {
              station.previousStations.push(newPreviousStationId);
            }
          }
          if (station.status === MapItemStatus.Normal) {
            station.status = MapItemStatus.Updated;
          }
        }
        if (station.dragging) {
          //ensure we cant get duplicate ids.
          if (!station.nextStations.includes(newNextStationId) && station.rithmId !== newNextStationId) {
            if (newPreviousStationId.length > 0 && newNextStationId.length > 0) {
              station.nextStations.push(newNextStationId);
            }
          }
        }
      }
    }

    this.mapService.currentMousePoint$.next(DEFAULT_MOUSE_POINT);
    this.dragItem = MapDragItem.Default;
    this.stations.forEach((station) => {
      if (station.dragging) {
        station.dragging = false;
        if (station.status === MapItemStatus.Normal) {
          station.status = MapItemStatus.Updated;
        }
        this.drawElements();
      }
    });

    this.eventStartCoords = DEFAULT_MOUSE_POINT;
    this.lastTouchCoords = [DEFAULT_MOUSE_POINT];
    this.mapCanvas.nativeElement.style.cursor = 'default';
  }

  /**
   * Logic for handling panning, dragging, etc on a mobile device.
   *
   * @param moveInput The point of movement.
   */
  private singleInputMoveLogic(moveInput: Point) {
    const moveAmountX = this.lastTouchCoords[0].x - moveInput.x;
    const moveAmountY = this.lastTouchCoords[0].y - moveInput.y;

    if (this.dragItem === MapDragItem.Map) {
      this.mapCanvas.nativeElement.style.cursor = 'move';
      this.currentCanvasPoint.x += moveAmountX / this.scale;
      this.lastTouchCoords[0].x = moveInput.x;
      this.currentCanvasPoint.y += moveAmountY / this.scale;
      this.lastTouchCoords[0].y = moveInput.y;
      this.drawElements();
    } else if (this.dragItem === MapDragItem.Station) {
      for (const station of this.stations) {
        if (station.dragging) {
          this.mapCanvas.nativeElement.style.cursor = 'grabbing';
          station.mapPoint.x -= moveAmountX / this.scale;
          this.lastTouchCoords[0].x = moveInput.x;
          station.mapPoint.y -= moveAmountY / this.scale;
          this.lastTouchCoords[0].y = moveInput.y;
          this.drawElements();
        }
      }
    } else if (this.dragItem === MapDragItem.Node) {
      this.mapCanvas.nativeElement.style.cursor = 'grabbing';
      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(this.mapService.currentMousePoint$.value, this.scale);
        if (station.dragging) {
          this.mapService.currentMousePoint$.next(moveInput);
          this.drawElements();
        }
      }
    } else {
      //Hovering over different station elements.
      for (const station of this.stations) {
        const previousHoverState = station.hoverActive;
        station.checkElementHover(moveInput, this.scale);
        if (station.hoverActive !== StationElementHoverType.None) {
          if (previousHoverState !== station.hoverActive) {
            this.drawElements();
          }
          // eslint-disable-next-line max-len
          if (!(this.mapMode === MapMode.View && (station.hoverActive === StationElementHoverType.Button || station.hoverActive === StationElementHoverType.Node))) {
            this.mapCanvas.nativeElement.style.cursor = 'pointer';
          }
          if (this.mapMode === MapMode.Build) {
            this.mapCanvas.nativeElement.style.cursor = 'pointer';
          }
          break;
        } else {
          if (previousHoverState !== station.hoverActive) {
            this.drawElements();
          }
          this.mapCanvas.nativeElement.style.cursor = 'default';
        }
      }
    }
  }

  /**
   * Logic for handling pinch to zoom.
   *
   * @param position An array of points representing your two fingers.
   */
  private pinchZoomLogic(position: Point[]) {
    const xBeginDiff = Math.abs(this.lastTouchCoords[0].x - this.lastTouchCoords[1].x);
    const yBeginDiff = Math.abs(this.lastTouchCoords[0].y - this.lastTouchCoords[1].y);
    const xCurrentDiff = Math.abs(position[0].x - position[1].x);
    const yCurrentDiff = Math.abs(position[0].y - position[1].y);
    const averageDiff = Math.floor((xCurrentDiff - xBeginDiff) + (yCurrentDiff - yBeginDiff) / 2);

    const middlePoint = {
      x: (position[0].x + position[1].x) / 2,
      y: (position[0].y + position[1].y) / 2
    };

    if (xCurrentDiff > xBeginDiff || yCurrentDiff > yBeginDiff) {
      // Zoom in
      this.lastTouchCoords = position;
      this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
      this.mapService.handleZoom(middlePoint, true);
    } else if (xCurrentDiff < xBeginDiff || yCurrentDiff < yBeginDiff) {
      // Zoom out
      this.lastTouchCoords = position;
      this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
      this.mapService.handleZoom(middlePoint, true);
    }
  }

  /**
   * Handle click events when click on station document badge, option button.
   *
   * @param point The position of mouse click event.
   */
  private clickEventHandler(point: Point) {
    const scaledStationWidth = STATION_WIDTH * this.scale;

    const interactiveBadgeRadius = BADGE_RADIUS * this.scale;
    const scaledBadgeMargin = BADGE_MARGIN * this.scale;

    const interactiveButtonRadius = BUTTON_RADIUS * this.scale + 9;
    const scaledButtonYMargin = BUTTON_Y_MARGIN * this.scale;
    const scaledButtonMargin = BADGE_MARGIN * this.scale;

    for (const station of this.stations) {
      const startingX = station.canvasPoint.x;
      const startingY = station.canvasPoint.y;

      if (point.x >= startingX + scaledStationWidth - scaledBadgeMargin - interactiveBadgeRadius
        && point.x <= startingX + scaledStationWidth - scaledBadgeMargin + interactiveBadgeRadius
        && point.y >= startingY + scaledBadgeMargin - interactiveBadgeRadius
        && point.y <= startingY + scaledBadgeMargin + interactiveBadgeRadius
      ) {
        this.dialog.open(StationDocumentsModalComponent, {
          minWidth: '370px',
          data: { stationName: station.stationName, stationId: station.rithmId }
        });
        break;
      }
      //Check if click was over option menu in build mode.
      if (this.mapMode === MapMode.Build) {
        if (point.x >= startingX + scaledStationWidth - scaledButtonMargin - interactiveButtonRadius
          && point.x <= startingX + scaledStationWidth - scaledButtonMargin + interactiveButtonRadius
          && point.y >= startingY + scaledButtonYMargin - interactiveButtonRadius
          && point.y <= startingY + scaledButtonYMargin + interactiveButtonRadius
        ) {
          this.mapService.currentMousePoint$.next(point);
          this.mapService.stationButtonClick$.next({ click: true, data: station });
          break;
        }
      }
    }
  }

  /**
   * Handles user input when a clicked connection line.
   *
   * @param event The click event points that was clicked.
   */
   openConnectionDrawer(event: PointerEvent): void {
    const mousePos = this.getEventContextPoint(event);

    for (const connectionLine of this.lineItems) {
      if (this.context.isPointInStroke(connectionLine.path, mousePos.x, mousePos.y)) {
        this.context.strokeStyle = '#00ff00';
        this.mapCanvas.nativeElement.style.cursor = 'pointer';
      } else {
        this.context.strokeStyle = CONNECTION_DEFAULT_COLOR;
        this.mapCanvas.nativeElement.style.cursor = 'default';
      }
      this.context.stroke(connectionLine.path);
    }
  }

}
