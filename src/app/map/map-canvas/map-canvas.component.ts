import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationMapElement } from 'src/helpers';
import { MapMode, Point, MapDragItem, MapItemStatus, FlowMapElement, StationElementHoverType } from 'src/models';
import { ConnectionElementService } from '../connection-element.service';
import { BADGE_MARGIN, BADGE_RADIUS,
  BUTTON_RADIUS, BUTTON_Y_MARGIN, DEFAULT_MOUSE_POINT,
  DEFAULT_SCALE,
  STATION_HEIGHT, STATION_WIDTH } from '../map-constants';
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
  private destroyed$ = new Subject();

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

  /** What type of thing is being dragged? */
  private dragItem = MapDragItem.Default;

  /** Data for station card used in the map. */
  stations: StationMapElement[] = [];

  /** Data for flow used in the map. */
  flows: FlowMapElement[] = [];

  /** Scale to calculate canvas points. */
  private scale = DEFAULT_SCALE;

  /**Track zoomCount. */
  zoomCount = 0;

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
    //Needed to get the correct font loaded before it gets drawn.
    const f = new FontFace('Montserrat-SemiBold', 'url(assets/fonts/Montserrat/Montserrat-SemiBold.ttf)');

    f.load().then(() => {
      // document.fonts.add(font);

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
          this.drawElements();
        });

      this.mapService.currentCanvasPoint$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((point) => {
          this.currentCanvasPoint = point;
          this.drawElements();
        });

      this.mapService.mapDataRecieved$
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          this.stations = this.mapService.stationElements;
          this.flows = this.mapService.flowElements;
          this.drawElements();
        });
      this.mapService.zoomCount$
        .pipe(takeUntil(this.destroyed$))
        .subscribe((count) => {
          this.zoomCount = count;
        });
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
   * Handles user input when a mouse button is pressed. Used for initiating dragging.
   *
   * @param event The mousedown event that was triggered.
   */
  @HostListener('mousedown', ['$event'])
  mouseDown(event: MouseEvent): void {
    this.eventStartCoords = this.getMouseCanvasPoint(event);

    const mousePos = this.getMouseCanvasPoint(event);
    this.eventStartLogic(mousePos);
  }

  /**
   * Handles user input when a mouse button is released. Used for placing dragged elements.
   *
   * @param event The mouseup event that was triggered.
   */
  @HostListener('mouseup', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mouseUp(event: MouseEvent): void {
    const mousePos = this.getMouseCanvasPoint(event);

    this.eventEndLogic(mousePos);
  }

  /**
   * Handles user input when a mouse cursor is moved. Used for calculating dragged element movement, or map pan drag.
   *
   * @param event The mousemove event that was triggered.
   */
  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {
    if (this.dragItem === MapDragItem.Map) {
      this.mapCanvas.nativeElement.style.cursor = 'move';
      this.currentCanvasPoint.x -= event.movementX / this.scale;
      this.currentCanvasPoint.y -= event.movementY / this.scale;
      this.drawElements();
    } else if (this.dragItem === MapDragItem.Station) {
      for (const station of this.stations) {
        if (station.dragging) {
          this.mapCanvas.nativeElement.style.cursor = 'grabbing';
          station.mapPoint.x += event.movementX / this.scale;
          station.mapPoint.y += event.movementY / this.scale;
          this.drawElements();
        }
      }
    } else if (this.dragItem === MapDragItem.Node) {
      this.mapCanvas.nativeElement.style.cursor = 'grabbing';
      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(this.mapService.currentMousePoint$.value, this.scale);
        if (station.dragging) {
          this.mapService.currentMousePoint$.next(this.getMouseCanvasPoint(event));
          this.drawElements();
        }
      }
    } else {
      //Track mouse position
      const mousePos = this.getMouseCanvasPoint(event);
      //Hovering over different station elements.
      for (const station of this.stations) {
        const previousHoverState = station.hoverActive;
        station.checkElementHover(mousePos, this.scale);
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
   * Handles input when a user presses a touchscreen. Used for initiating dragging.
   *
   * @param event The touchstart event that was triggered.
   */
  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent): void {
    event.preventDefault();

    if (event.touches.length === 1) {
      const touchPoint = event.touches[0];
      const touchPos = this.getTouchCanvasPoint(touchPoint);

      this.lastTouchCoords[0] = touchPos;
      this.eventStartCoords = touchPos;

      this.eventStartLogic(touchPos);
    }

    if (event.touches.length === 2) {
      const touchPoint1 = event.touches[0];
      const touchPoint2 = event.touches[1];

      this.lastTouchCoords = [this.getTouchCanvasPoint(touchPoint1), this.getTouchCanvasPoint(touchPoint2)];
      this.eventStartCoords = this.getTouchCanvasPoint(touchPoint1);
    }

  }


  /**
   * Handles user input when a user lifts their finger. Used for placing dragged elements.
   *
   * @param event The touchend event that was triggered.
   */
  @HostListener('touchend', ['$event'])
  touchEnd(event: TouchEvent): void {
    event.preventDefault();

    const touchPoint = event.changedTouches[0];
    const touchPos = this.getTouchCanvasPoint(touchPoint);

    this.eventEndLogic(touchPos);
  }

  /**
   * Handles input when a user drags their finger across the screen. Used for calculating dragged element movement, or map pan drag.
   *
   * @param event The touchmove event that was triggered.
   */
  @HostListener('touchmove', ['$event'])
  touchMove(event: TouchEvent): void {
    event.preventDefault();

    //Single touch.
    if (event.touches.length === 1) {
      const touchPoint = event.changedTouches[0];
      const touchPos = this.getTouchCanvasPoint(touchPoint);

      const moveAmountX = this.lastTouchCoords[0].x - touchPos.x;
      const moveAmountY = this.lastTouchCoords[0].y - touchPos.y;

      if (this.dragItem === MapDragItem.Map) {
        this.currentCanvasPoint.x += moveAmountX / this.scale;
        this.lastTouchCoords[0].x = touchPos.x;
        this.currentCanvasPoint.y += moveAmountY / this.scale;
        this.lastTouchCoords[0].y = touchPos.y;
        this.drawElements();
      } else if (this.dragItem === MapDragItem.Station) {
        for (const station of this.stations) {
          if (station.dragging) {
            station.mapPoint.x -= moveAmountX / this.scale;
            this.lastTouchCoords[0].x = touchPos.x;
            station.mapPoint.y -= moveAmountY / this.scale;
            this.lastTouchCoords[0].y = touchPos.y;
            this.drawElements();
          }
        }
      } else if (this.dragItem === MapDragItem.Node) {
        for (const station of this.stations) {
          // Check if clicked on an interactive station element.
          station.checkElementHover(this.mapService.currentMousePoint$.value, this.scale);
          if (station.dragging) {
            this.mapService.currentMousePoint$.next(touchPos);
            this.drawElements();
          }
        }
      }
    }

    //Pinch event.
    if (event.touches.length === 2) {
      const touchPoint = event.changedTouches;
      const touchPos = [this.getTouchCanvasPoint(touchPoint[0]), this.getTouchCanvasPoint(touchPoint[1])];

      const xBeginDiff = Math.abs(this.lastTouchCoords[0].x - this.lastTouchCoords[1].x);
      const yBeginDiff = Math.abs(this.lastTouchCoords[0].y - this.lastTouchCoords[1].y);
      const xCurrentDiff = Math.abs(touchPos[0].x - touchPos[1].x);
      const yCurrentDiff = Math.abs(touchPos[0].y - touchPos[1].y);
      const averageDiff = (xCurrentDiff - xBeginDiff) + (yCurrentDiff - yBeginDiff) / 2;

      const middlePoint = {
        x: (touchPos[0].x + touchPos[1].x) / 2,
        y: (touchPos[0].y + touchPos[1].y) / 2
      };

      if (xCurrentDiff > xBeginDiff || yCurrentDiff > yBeginDiff) {
        // Zoom in
        this.lastTouchCoords = touchPos;
        this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
        this.mapService.handleZoom(middlePoint, true);
        this.drawElements();
      } else if (xCurrentDiff < xBeginDiff || yCurrentDiff < yBeginDiff) {
        // Zoom out
        this.lastTouchCoords = touchPos;
        this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
        this.mapService.handleZoom(middlePoint, true);
        this.drawElements();
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
    const mousePoint = this.getMouseCanvasPoint(event);

    if (event.deltaY < 0) {
      // Zoom in
      this.mapService.zoomCount$.next(this.zoomCount + 10);
      this.mapService.handleZoom(mousePoint, false);
    } else {
      // Zoom out
      this.mapService.zoomCount$.next(this.zoomCount - 10);
      this.mapService.handleZoom(mousePoint, false);
    }

    event.preventDefault();
  }

  /**
   * Draws all the elements on the canvas.
   */
  private drawElements(): void {
    requestAnimationFrame(() => {
      // Clear the canvas
      this.context.clearRect(0, 0, this.mapCanvas.nativeElement.width, this.mapCanvas.nativeElement.height);

      // Calculate the station canvas points
      this.stations.forEach((station) => {
        station.canvasPoint = this.mapService.getCanvasPoint(station.mapPoint);
      });

      // Draw the connections
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
          this.connectionElementService.drawConnection(startPoint, endPoint);
        }
      }

      // Draw the stations
      this.stations.forEach((station) => {
        this.stationElementService.drawStation(station, this.mapMode, this.mapService.currentMousePoint$.value, this.dragItem);
      });

      // Draw the flows
      this.flowElementService.drawFlow(this.stations);
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
   * Determines the point on the canvas that the mouse cursor is positioned.
   *
   * @param event The mouse event for the cursor information.
   * @returns An accurate point for the mouse position on the canvas.
   */
  private getMouseCanvasPoint(event: MouseEvent): Point {
    const canvasRect = this.mapCanvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
  }

  /**
   * Determines the point on the canvas that a finger is positioned.
   *
   * @param event The touch event for the cursor information.
   * @returns An accurate point for the touch position on the canvas.
   */
  private getTouchCanvasPoint(event: Touch): Point {
    const canvasRect = this.mapCanvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
  }

  /**
   * Handles mouseDown and touchStart logic.
   *
   * @param position The position of the mouse or touch event.
   */
  private eventStartLogic(position: Point) {
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
          this.mapService.currentMouseClick$.next(true);
          break;
        }
      }
    }
  }

}
