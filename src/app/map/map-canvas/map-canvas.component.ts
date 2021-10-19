import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationMapElement } from 'src/helpers';
import { MapMode, Point, MapDragItem, MapItemStatus, FlowMapElement, StationElementHoverType } from 'src/models';
import { ConnectionElementService } from '../connection-element.service';
import { DEFAULT_SCALE, STATION_HEIGHT, STATION_WIDTH, ZOOM_VELOCITY } from '../map-constants';
import { MapService } from '../map.service';
import { StationElementService } from '../station-element.service';
import { FlowElementService } from '../flow-element.service';

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

  /** The coordinate where the mouse or touch is located, while it's being tracked. */
  cursorPoint: Point = { x: -1, y: -1 };

  /** The coordinate where the mouse or touch event begins. */
  private eventStartCoords: Point = {x: -1, y: -1};

  /** Used to track map movement on a touchscreen. */
  private lastTouchCoords: Point = {x: -1, y: -1};

  /** What type of thing is being dragged? */
  private dragItem = MapDragItem.Default;

  /** Data for station card used in the map. */
  stations: StationMapElement[] = [];

  /** Data for flow used in the map. */
  flows: FlowMapElement[] = [];

  /** Scale to calculate canvas points. */
  private scale = DEFAULT_SCALE;

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
    private flowElementService: FlowElementService
  ) {
    //Needed to get the correct font loaded before it gets drawn.
    const f = new FontFace('Montserrat-SemiBold','url(assets/fonts/Montserrat/Montserrat-SemiBold.ttf)');

    f.load().then((font) => {
      document.fonts.add(font);

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
      for (const station of this.stations) {
        if (station.dragging) {
          this.mapCanvas.nativeElement.style.cursor = 'grabbing';
          this.cursorPoint = this.getMouseCanvasPoint(event);
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
          this.mapCanvas.nativeElement.style.cursor = 'pointer';
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
    //TODO: support multitouch.
    const touchPoint = event.touches[0];

    this.lastTouchCoords = this.getTouchCanvasPoint(touchPoint);
    this.eventStartCoords = this.getTouchCanvasPoint(touchPoint);

    const touchPos = this.getTouchCanvasPoint(touchPoint);
    this.eventStartLogic(touchPos);
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
    //TODO: support multitouch.
    const touchPoint = event.changedTouches[0];
    const touchPos = this.getTouchCanvasPoint(touchPoint);

    const moveAmountX = this.lastTouchCoords.x - touchPos.x;
    const moveAmountY = this.lastTouchCoords.y - touchPos.y;

    if (this.dragItem === MapDragItem.Map) {
      this.currentCanvasPoint.x += moveAmountX / this.scale;
      this.lastTouchCoords.x = touchPos.x;
      this.currentCanvasPoint.y += moveAmountY / this.scale;
      this.lastTouchCoords.y = touchPos.y;
      this.drawElements();
    } else if (this.dragItem === MapDragItem.Station) {
      for (const station of this.stations) {
        if (station.dragging) {
          station.mapPoint.x -= moveAmountX / this.scale;
          this.lastTouchCoords.x = touchPos.x;
          station.mapPoint.y -= moveAmountY / this.scale;
          this.lastTouchCoords.y = touchPos.y;
          this.drawElements();
        }
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
      this.mapService.zoom(ZOOM_VELOCITY, mousePoint);
    } else {
      // Zoom out
      this.mapService.zoom(1 / ZOOM_VELOCITY, mousePoint);
    }

    this.drawElements();
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
        this.stationElementService.drawStation(station, this.mapMode, this.cursorPoint);
      });

      // Draw the flows
        this.flowElementService.drawFlow(this.stations);
    });
  }

  /**
   * Sets an accurate canvas size based on the viewport and scales the canvas for accurate display on HiDPI/Retina displays.
   */
  private setCanvasSize(): void {
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
        } else if (position.x >= station.canvasPoint.x && position.x <= station.canvasPoint.x + STATION_WIDTH * this.scale &&
          position.y >= station.canvasPoint.y && position.y <= station.canvasPoint.y + STATION_HEIGHT * this.scale) {
          station.dragging = true;
          this.dragItem = MapDragItem.Station;
          break;
        }
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
        const coords: Point = {x: 0, y: 0};
        coords.x = position.x - STATION_WIDTH/2;
        coords.y = position.y - STATION_HEIGHT/2;

        //create a new station at click.
        this.mapService.createNewStation(coords);

        //After clicking, set to build mode.
        this.mapService.mapMode$.next(MapMode.Build);
      }
    }

    this.cursorPoint = { x: -1, y: -1 };
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

    this.eventStartCoords = {x: -1, y: -1};
    this.lastTouchCoords = {x: -1, y: -1};
    this.mapCanvas.nativeElement.style.cursor = 'default';
  }
}
