import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ConnectionMapElement,
  StationGroupMapElement,
  StationMapElement,
} from 'src/helpers';
import {
  MapMode,
  Point,
  MapDragItem,
  MapItemStatus,
  StationElementHoverItem,
  StationInfoDrawerData,
  StationInformation,
  StationGroupElementHoverItem,
} from 'src/models';
import { ConnectionElementService } from '../connection-element.service';
import { MapBoundaryService } from '../map-boundary.service';
import {
  DEFAULT_MOUSE_POINT,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  PAN_DECAY_RATE,
  PAN_TRIGGER_LIMIT,
  SCALE_RENDER_STATION_ELEMENTS,
  STATION_HEIGHT,
  STATION_WIDTH,
  ZOOM_VELOCITY,
  MAX_PAN_VELOCITY,
  MOUSE_MOVEMENT_OVER_CONNECTION,
  TOUCH_EVENT_MARGIN,
} from '../map-constants';
import { MapService } from '../map.service';
import { StationElementService } from '../station-element.service';
import { StationGroupElementService } from '../station-group-element.service';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';

/**
 * Component for the main `<canvas>` element used for the map.
 */
@Component({
  selector: 'app-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss'],
})
export class MapCanvasComponent implements OnInit, OnDestroy {
  /** Reference to the main canvas element used for the map. */
  @ViewChild('map', { static: true })
  private mapCanvas!: ElementRef<HTMLCanvasElement>;

  /** Subject for whether the component was destroyed. */
  private destroyed$ = new Subject<void>();

  /** The rendering context for the canvas element for the map. */
  private context!: CanvasRenderingContext2D;

  /** Modes for canvas element used for the map. Set to view by default. */
  mapMode = MapMode.View;

  //The next several properties relate to automatically panning the map in a given direction.
  /** Checks if automatic pan is triggered by being on the edge of the screen, or in other words: outside the pan bounding box. */
  private outsideBox = false;

  /** Checks if automatic pan is triggered by a fast map drag. */
  private fastDrag = false;

  /** Used to check if a fast drag should be cancelled. */
  private holdDrag = false;

  /** Flag for auto pan checks. While true, a pan loop will continually execute.*/
  private panActive = false;

  /** Track what the next pan velocity is. Pan velocity determines what direction and how fast the map automatically pans. */
  private nextPanVelocity: Point = { x: 0, y: 0 };

  /**
   * The coordinate at which the canvas is currently rendering in regards to the overall map.
   * This point is the top left corner of the visible map.
   */
  currentCanvasPoint: Point = { x: 0, y: 0 };

  /**
   * The coordinate at which the current mouse point is being tracked on the canvas.
   * While the mouse is not being tracked, it is set to { x: -1, y: -1 }.
   */
  currentMousePoint: Point = DEFAULT_MOUSE_POINT;

  /** Requested animation frame for raf.*/
  private myReq?: number;

  /** The coordinate on the canvas where the mouse or touch event begins. */
  private eventStartCoords: Point = DEFAULT_MOUSE_POINT;

  /** Used to track last recorded position when calculating map movement. */
  private lastTouchCoords: Point[] = [DEFAULT_MOUSE_POINT];

  /** Used to track number of touches. Needed to handle multi-touch interactions with pointer events.*/
  private pointerCache: PointerEvent[] = [];

  /** What type of thing is being dragged? Set to default by default.*/
  private dragItem = MapDragItem.Default;

  /** An array of data used to render and interact with station cards in the map. */
  stations: StationMapElement[] = [];

  /** An array of data used to render and interact with station groups in the map. */
  stationGroups: StationGroupMapElement[] = [];

  /** An array of data used to render and interact with connection line paths between stations in the map. */
  connections: ConnectionMapElement[] = [];

  /**
   * This is set to true initially than set to false once the map has initialized.
   * Used to allow methods to have a separate behavior for when the map first loads. Such as the center method.
   */
  private initLoad = true;

  /** Scale to calculate canvas points. Defaults to 1. Zooming adjusts this scale exponentially. */
  private scale = DEFAULT_SCALE;

  //The next two properties relate to zoom.
  /**Track zoomCount. This count determines the number of times to run a zoom function and whether to zoom in or out.*/
  private zoomCount = 0;

  /**Set up interval for zoom. This allows us animate zooming through a loop.*/
  private zoomInterval?: NodeJS.Timeout;

  /** Boolean to check drag on connection line. When true a connection line is currently being dragged. */
  private connectionLineDrag = false;

  /** Storing broken connection line. Used when moving a connection line.*/
  private storedConnectionLine: ConnectionMapElement | null = null;

  /**Adding boundary box inner padding for top-left and bottom-right. */
  readonly boundaryPadding = { topLeft: 50, rightBottom: 100 };

  /**
   * Add station mode active. This get is true when this.mapMode is set to stationAdd.
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
    private stationGroupElementService: StationGroupElementService,
    private dialog: MatDialog,
    private sidenavDrawerService: SidenavDrawerService,
    private stationService: StationService,
    private mapBoundaryService: MapBoundaryService
  ) {
    //This subscribe sets this.mapMode when the behavior subject in mapService changes, then redraws the map.
    this.mapService.mapMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mapMode) => {
        this.mapMode = mapMode;
        this.drawElements();
      });

    /* This subscribe sets this.scale when the behavior subject in mapService changes.
    Then it executes a loop to more cleanly handle scale change animation. */
    this.mapService.mapScale$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((scale) => {
        this.scale = scale;
        this.scaleChangeDraw();
      });

    //This subscribe sets this.currentCanvasPoint when the behavior subject in mapService changes, then redraws the map.
    this.mapService.currentCanvasPoint$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((point) => {
        this.currentCanvasPoint = point;
        this.drawElements();
      });

    //This subscribe sets this.stations when the behavior subject in mapService changes, then redraws the map.
    this.mapService.stationElementsChanged$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.stations = this.mapService.stationElements;
        this.drawElements();
      });

    //This subscribe sets this.zoomCount when the behavior subject in mapService changes.
    this.mapService.zoomCount$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((count) => {
        this.zoomCount = count;
      });

    /* This subscribe sets this.currentMousePoint when the behavior subject changes.
    If this.dragItem is set to node or station:
    checks to see if the mouse is on the edge of the screen, or in other words, outside the pan bounding box,
    it then sets this.nextPanVelocity to the velocity set during that check and then activates auto pan if appropriate.

    Simply put: if a station or node is dragged to the edge of the screen, the map should start panning.*/
    this.mapService.currentMousePoint$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((point) => {
        this.currentMousePoint = point;
        if (
          this.dragItem === MapDragItem.Node ||
          this.dragItem === MapDragItem.Station
        ) {
          const velocity = this.getOutsideBoundingBoxPanVelocity(
            this.currentMousePoint
          );
          this.outsideBox = !(velocity.x === 0 && velocity.y === 0);
          this.nextPanVelocity = velocity;
          this.checkAutoPan();
        }
      });

    /* This subscribe sets this.nextPanVelocity when the behavior subject in mapService changes.
    Then it checks if auto pan should be activated.
    This is needed to pan the map when the center method is called. */
    this.mapService.centerPanVelocity$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((velocity) => {
        this.nextPanVelocity = velocity;
        this.checkAutoPan();
      });
  }

  /**
   * Scales the canvas and does initial draw for elements.
   * Sets this.stations, this.stationGroupElements, and this.connections to the properties in mapService.
   * Sets several properties and calls the center method.
   */
  ngOnInit(): void {
    //The map needs the canvas context to be set to CanvasRenderingContext2D.
    this.context = this.mapCanvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.mapService.registerCanvasContext(this.context);

    //Sets the canvas to the size and DPI of the screen.
    this.setCanvasSize();

    this.mapService.mapDataReceived$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dataReceived) => {
        //When the mapDataReceived behavior subject changes, update class properties.
        //Any stations with status set to deleted should not be rendered.
        this.stations = this.mapService.stationElements.filter(
          (e) => e.status !== MapItemStatus.Deleted
        );
        this.stationGroups = this.mapService.stationGroupElements;
        this.connections = this.mapService.connectionElements;

        //If this is the first time the component is being initialized, center the map without animation.
        if (dataReceived && this.initLoad) {
          this.mapService.centerActive$.next(true);
          this.mapService.centerCount$.next(1);
          this.mapService.center(dataReceived);
          this.initLoad = false;
        }

        //Redraw to reflect changes.
        this.drawElements();
      });

    //Redraw again for good measure.
    this.drawElements();
  }

  /**
   * Cleans up subscription when the component is destroyed. Reset several mapService properties.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.mapService.stationElements = [];
    this.mapService.stationGroupElements = [];
    this.mapService.connectionElements = [];
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
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    /* Make sure that the browser is compatible with pointer events.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
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

      //If using a single touch or click, calculate it, then run the event start logic.
      if (this.pointerCache.length === 1) {
        const pointer = this.pointerCache[0];
        this.lastTouchCoords[0] = this.getEventCanvasPoint(pointer);
        this.eventStartCoords = this.getEventCanvasPoint(pointer);
        this.eventStartLogic(event);
      }

      //If using two touches, make sure both touches are accounted for.
      if (this.pointerCache.length === 2) {
        const pointer1 = this.pointerCache[0];
        const pointer2 = this.pointerCache[1];

        this.lastTouchCoords = [
          this.getEventCanvasPoint(pointer1),
          this.getEventCanvasPoint(pointer2),
        ];
        this.eventStartCoords = this.getEventCanvasPoint(pointer1);
      }

      /* If something is being dragged, capture the pointer event in the canvas element.
      This allows the mouse/touch to leave the canvas boundaries and continue registering events. */
      if (this.dragItem !== MapDragItem.Default) {
        const map = document.getElementById('map');
        map?.setPointerCapture(event.pointerId);
      }
    }
  }

  /**
   * Handles user input when releasing and a pointer event is fired.
   *
   * @param event The pointerup event that was triggered.
   */
  @HostListener('pointerup', ['$event'])
  pointerUp(event: PointerEvent): void {
    /* Firefox for android doesn't get along with pointer events well, as of 11/11/21.
    We disable pointer event listening and use touch events instead in this case. */
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    /* Make sure that the browser is compatible with pointer events.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
    if (window.PointerEvent && !(is_android && is_firefox)) {
      event.preventDefault();

      /* Remove event from cache. This ensures that if there are multiple pointer events being tracked,
      like in the case of a pinch drag, instead of cancelling the entire event when a finger lifts,
      we'll simply track the leftover input and use the corresponding event logic. */
      for (let i = 0; i < this.pointerCache.length; i++) {
        if (this.pointerCache[i].pointerId === event.pointerId) {
          this.pointerCache.splice(i, 1);
          break;
        }
      }

      //If there are no more pointer events cached.
      if (this.pointerCache.length === 0) {
        //Release the pointer capture so that you can interact with other elements.
        if (this.dragItem !== MapDragItem.Default) {
          const map = document.getElementById('map');
          map?.releasePointerCapture(event.pointerId);
        }

        //Trigger the logic for when an event ends.
        this.eventEndLogic(event);
        //If there are still pointer events, set lastTouchCoords to leftover pointer.
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
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    /* Make sure that the browser is compatible with pointer events.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
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

      //If there's only a single pointer event, trigger the appropriate logic.
      if (this.pointerCache.length === 1) {
        const pointer = this.pointerCache[0];
        this.singleInputMoveLogic(pointer);
      }

      // If there are two pointer events, trigger pinch zoom logic.
      if (this.pointerCache.length === 2) {
        const pointer1 = this.pointerCache[0];
        const pointer2 = this.pointerCache[1];

        const pos = [
          this.getEventCanvasPoint(pointer1),
          this.getEventCanvasPoint(pointer2),
        ];
        this.pinchZoomLogic(pos);
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
    //When browser isn't compatible with pointer events, we use mouse events instead.
    if (!window.PointerEvent) {
      this.eventStartCoords = this.getEventCanvasPoint(event);
      this.lastTouchCoords[0] = this.getEventCanvasPoint(event);
      this.eventStartCoords = this.getEventCanvasPoint(event);
      this.eventStartLogic(event);
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
    //When browser isn't compatible with pointer events, we use mouse events instead.
    if (!window.PointerEvent) {
      this.lastTouchCoords[0] = this.getEventCanvasPoint(event);
      this.eventEndLogic(event);
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
    //When browser isn't compatible with pointer events, we use mouse events instead.
    if (!window.PointerEvent) {
      this.singleInputMoveLogic(event);
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
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    /* When browser isn't compatible with pointer events, we use mouse events instead.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
    if (!window.PointerEvent || (is_android && is_firefox)) {
      //If using a single touch, calculate it, then run the event start logic.
      if (event.touches.length === 1) {
        const touchPoint = event.touches[0];
        const eventCanvasPoint = this.getEventCanvasPoint(touchPoint);

        this.lastTouchCoords[0] = eventCanvasPoint;
        this.eventStartCoords = eventCanvasPoint;

        this.eventStartLogic(touchPoint);
      }

      //If using two touches, make sure both touches are accounted for.
      if (event.touches.length === 2) {
        const touchPoint1 = event.touches[0];
        const touchPoint2 = event.touches[1];

        this.lastTouchCoords = [
          this.getEventCanvasPoint(touchPoint1),
          this.getEventCanvasPoint(touchPoint2),
        ];
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
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    /* When browser isn't compatible with pointer events, we use mouse events instead.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
    if (!window.PointerEvent || (is_android && is_firefox)) {
      const touchPoint = event.changedTouches[0];
      this.eventEndLogic(touchPoint);
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
    const is_firefox =
      navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const is_android =
      navigator.userAgent.toLowerCase().indexOf('android') > -1;

    event.preventDefault();

    /* When browser isn't compatible with pointer events, we use mouse events instead.
    Also in the case of Firefox for Android, we use touch events instead of pointer events. */
    if (!window.PointerEvent || (is_android && is_firefox)) {
      //If there's only a single touch event, trigger the appropriate logic.
      if (event.touches.length === 1) {
        const touchPoint = event.changedTouches[0];
        this.singleInputMoveLogic(touchPoint);
      }

      //If there are two touch events, trigger pinch zoom logic.
      if (event.touches.length === 2) {
        const touchPoint = event.changedTouches;
        const pos = [
          this.getEventCanvasPoint(touchPoint[0]),
          this.getEventCanvasPoint(touchPoint[1]),
        ];

        this.pinchZoomLogic(pos);
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
   * Handles user input when a key is pressed. Used for zoom in and zoom out.
   *
   * @param event The keyboard event that was triggered.
   */
  @HostListener('document:keypress', ['$event'])
  keyPress(event: KeyboardEvent): void {
    //Make sure there is no drawer currently open on the map.
    if (!this.sidenavDrawerService.isDrawerOpen) {
      // Allow plus and minus keys to trigger zooming in and out.
      if (event.key === '+' || event.key === '=' || event.key === '-') {
        //If station menu is open, close it.
        this.mapService.matMenuStatus$.next(true);
        this.mapService.zoomCount$.next(
          this.zoomCount + (event.key === '+' || event.key === '=' ? 50 : -50)
        );
        this.mapService.handleZoom(false);
      }
    }
  }

  /**
   * Handles user input when a mouse wheel is scrolled. Used for zoom.
   *
   * @param event The wheel event that was triggered.
   */
  @HostListener('wheel', ['$event'])
  wheel(event: WheelEvent): void {
    event.preventDefault();
    //If map is in the middle of a center animation, cancel it.
    this.mapService.centerActive$.next(false);
    this.mapService.centerPanVelocity$.next({ x: 0, y: 0 });
    this.mapService.centerCount$.next(0);

    //Track where the mouse is located on the canvas after the wheel event is triggered.
    const mousePoint = this.getEventCanvasPoint(event);
    /* Wheel events return a number based on how fast you scrolled.
    The higher the number the faster you're scrolling.
    We need to track that number to determine how much to increment/decrement zoomCount. */
    const eventAmount =
      //Is the zoom out attempt fast?
      event.deltaY >= 100
        ? //If so, set eventAmount divided by 100.
          Math.floor(event.deltaY / 100)
        : //is the zoom in attempt fast?
        event.deltaY <= -100
        ? //If so, set eventAmount divided by 100.
          Math.ceil(event.deltaY / 100)
        : //If not fast, only divide by 3.
          event.deltaY / 3;

    //If a zoom in is attempted when scrolling.
    if (event.deltaY < 0) {
      // Do nothing if already at max zoom.
      if (this.scale >= MAX_SCALE) {
        this.mapService.zoomCount$.next(0);
        return;
      }
      //If map is in the middle of zooming out, cancel it.
      if (this.zoomCount < 0) {
        this.mapService.zoomCount$.next(0);
      }
      //Adjust the zoomCount based on the eventAmount.
      this.mapService.zoomCount$.next(
        this.zoomCount + Math.floor(10 * -eventAmount)
      );
      //Trigger zoom logic.
      this.mapService.handleZoom(false, mousePoint);
      //If a zoom out is attempted when scrolling.
    } else {
      // Do nothing if already at min zoom, in build or view mode.
      if (
        this.scale <= MIN_SCALE ||
        (this.mapService.mapMode$.value !== MapMode.View &&
          this.scale <= SCALE_RENDER_STATION_ELEMENTS / ZOOM_VELOCITY)
      ) {
        this.mapService.zoomCount$.next(0);
        return;
      }
      //If map is in the middle of zooming in, cancel it.
      if (this.zoomCount > 0) {
        this.mapService.zoomCount$.next(0);
      }
      //Adjust the zoomCount based on the eventAmount.
      this.mapService.zoomCount$.next(
        this.zoomCount - Math.floor(10 * eventAmount)
      );
      //Trigger zoom logic.
      this.mapService.handleZoom(false, mousePoint);
    }
    // Overlay option menu close state.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }
  }

  /**
   * Animates at a set framerate when scale is changed.
   * This allows us to limit the amount of draw elements calls we make when zooming, improving performance.
   *
   * @param fps The framerate to animate at.
   */
  private scaleChangeDraw(fps = 60): void {
    //This should only trigger if the zoomCount is not 0.
    if (this.zoomCount !== 0) {
      //If this.zoomInterval is not defined, set the interval.
      if (!this.zoomInterval) {
        this.zoomInterval = setInterval(() => {
          /* Once this.zoomCount is 0, clear the interval and set This.zoomInterval to undefined.
          This cancels the loop. Ending the animation. */
          if (this.zoomCount === 0 && this.zoomInterval) {
            clearInterval(this.zoomInterval);
            this.zoomInterval = undefined;
          }
          //Redraw the map every frame the loop is active.
          this.drawElements();
        }, 1000 / fps);
      }
    }
  }

  /**
   * Uses a setInterval to continuously check if the map should be auto panning.
   * Used when outside the auto pan bounding box and dragging a station or node.
   * Used with a fast map drag.
   * Used when center button is pressed.
   * //TODO: Allow use when middle wheel is active.
   */
  private checkAutoPan(): void {
    //If panning is due to being outside the station dragging bounding box.
    if (
      !this.panActive &&
      this.outsideBox &&
      this.currentMousePoint !== DEFAULT_MOUSE_POINT
    ) {
      //Set this.panActive to true so that there can only be one auto pan look going at a time.
      this.panActive = true;
      //The loop to run on each animation frame.
      const step = (): void => {
        //Take the current nextPanvelocity, and for one animation frame, use that to autoPan.
        this.autoMapPan(this.nextPanVelocity);
        //If we're currently tracking the mouse point and it is outside the auto pan bounding box.
        if (this.outsideBox && this.currentMousePoint !== DEFAULT_MOUSE_POINT) {
          //Loop through again.
          this.myReq = requestAnimationFrame(step);
        } else {
          //Close loop. Reset Properties.
          cancelAnimationFrame(this.myReq as number);
          this.panActive = false;
        }
      };
      //Begin loop.
      this.myReq = requestAnimationFrame(step);
    }

    //If panning is due to a fast drag.
    if (!this.panActive && this.fastDrag) {
      //Set this.panActive to true so that there can only be one auto pan look going at a time.
      this.panActive = true;
      //The loop to run on each animation frame.
      const step = (): void => {
        //Take the current nextPanvelocity, and for one animation frame, use that to autoPan.
        this.autoMapPan(this.nextPanVelocity);
        //If current nextPanVelocity is >= the absolute value of 1 in either direction.
        if (
          Math.abs(this.nextPanVelocity.x) >= 1 ||
          Math.abs(this.nextPanVelocity.y) >= 1
        ) {
          //decrease the value of nextPanVelocity by a set amount.
          this.nextPanVelocity = {
            x: this.nextPanVelocity.x * PAN_DECAY_RATE,
            y: this.nextPanVelocity.y * PAN_DECAY_RATE,
          };
          //Loop through again.
          this.myReq = requestAnimationFrame(step);
        } else {
          //Close loop. Reset properties.
          cancelAnimationFrame(this.myReq as number);
          this.panActive = false;
          this.fastDrag = false;
          this.nextPanVelocity = { x: 0, y: 0 };
          this.mapService.currentCanvasPoint$.next(this.currentCanvasPoint);
        }
      };
      //Begin loop.
      this.myReq = requestAnimationFrame(step);
    }

    //If panning is due to center button being pressed.
    if (!this.panActive && this.mapService.centerActive$.value) {
      //Set this.panActive to true so that there can only be one auto pan look going at a time.
      this.panActive = true;
      //The loop to run on each animation frame.
      const step = (): void => {
        //Take the current nextPanvelocity, and for one animation frame, use that to autoPan.
        this.autoMapPan(this.nextPanVelocity);
        //If center button was pressed, centerActive will be set to true, unless it was cancelled or finished.
        if (this.mapService.centerActive$.value) {
          //Loop through again.
          this.myReq = requestAnimationFrame(step);
        } else {
          //Close loop. Reset properties.
          cancelAnimationFrame(this.myReq as number);
          this.panActive = false;
        }
      };
      //Begin loop.
      this.myReq = requestAnimationFrame(step);
    }
  }

  /**
   * Draws all the elements on the canvas.
   */
  private drawElements(): void {
    requestAnimationFrame(() => {
      //Check the screen's DPI.
      const pixelRatio = window.devicePixelRatio || 1;
      // Clear the canvas. This erases everything drawn on the map.
      this.context.clearRect(
        0,
        0,
        this.mapCanvas.nativeElement.width / pixelRatio,
        this.mapCanvas.nativeElement.height / pixelRatio
      );

      //Update station and connection positions.
      this.mapService.updateStationCanvasPoints();

      // Draw the station groups
      this.stationGroupElementService.drawStationGroups();

      // Draw the connections
      this.connections.forEach((connection) => {
        this.connectionElementService.drawConnection(connection);
      });

      // Draw the Boundary box
      this.drawBoundaryBox();

      // Draw the stations
      this.stations.forEach((station) => {
        this.stationElementService.drawStation(
          station,
          this.mapMode,
          this.mapService.currentMousePoint$.value,
          this.dragItem
        );
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

    //Check the screen's DPI.
    const pixelRatio = window.devicePixelRatio || 1;
    const canvasBoundingRect =
      this.mapCanvas.nativeElement.getBoundingClientRect();
    //This sets the canvas to be a the size of the screen * the pixelRatio. This makes it bigger than what is displayed.
    this.mapCanvas.nativeElement.width = canvasBoundingRect.width * pixelRatio;
    this.mapCanvas.nativeElement.height =
      canvasBoundingRect.height * pixelRatio;
    //This scales down the canvas to it's actual size. Doing it like this ensures that everything is crisp on HiDPI screens.
    this.context.scale(pixelRatio, pixelRatio);
  }

  /**
   * Calculates a bounding box around the border of the canvas.
   * If a station or connection node is dragged outside this box,
   * returns a pan velocity so that the map automatically starts panning.
   *
   * @param position The position of the pointer, etc event.
   * @returns Boolean.
   */
  private getOutsideBoundingBoxPanVelocity(position: Point): Point {
    /*TODO: change name of method and related terminology to avoid confusion with the boundary box.
    For now: *bounding box* refers to an invisible box that, when the cursor is moved outside of, triggers a function.
    *boundary box* is a visible box surrounding a user's map that prevents stations from being placed too far away.*/
    //Store the dimensions of the canvas.
    const canvasRect = this.mapCanvas.nativeElement.getBoundingClientRect();
    /* Sets a number that will be used to check the position of the cursor against.
    This number is set dynamically based on screen size. The bounding box is set according to this number. */
    const box = () => {
      //number will be 120 or greater.
      if (((window.innerHeight + window.innerWidth) / 2) * 0.05 > 120) {
        return ((window.innerHeight + window.innerWidth) / 2) * 0.05;
      } else {
        return 120;
      }
    };

    // Set up a panVelocity that will be adjusted later.
    const panVelocity: Point = { x: 0, y: 0 };
    // The Publish and Cancel buttons are on the bottom of the screen in mobile, so we need to account for them.
    const mobileAdjust = window.innerWidth < 768 ? 36 : 0;

    //Set direction and speed to pan x.
    //Check if cursor position is outside the left edge of the bounding box.
    if (position.x < box()) {
      //Set the x coord of the panVelocity based on how close to the edge of the screen the cursor is.
      const leftPan = Math.floor(
        ((box() - position.x) * MAX_PAN_VELOCITY * 0.01) / this.scale
      );
      //If leftPan is > MAX_PAN_VELOCITY, used that instead.
      panVelocity.x =
        leftPan <= Math.floor(MAX_PAN_VELOCITY / this.scale)
          ? leftPan
          : Math.floor(MAX_PAN_VELOCITY / this.scale);
      //Check if cursor position is outside the right edge of the bounding box.
    } else if (position.x > canvasRect.width - box()) {
      //Set the x coord of the panVelocity based on how close to the edge of the screen the cursor is.
      const rightPan = Math.floor(
        ((canvasRect.width - box() - position.x) * MAX_PAN_VELOCITY * 0.01) /
          this.scale
      );
      //If rightPan is > MAX_PAN_VELOCITY, used that instead.
      panVelocity.x =
        rightPan >= Math.floor(-MAX_PAN_VELOCITY / this.scale)
          ? rightPan
          : Math.floor(-MAX_PAN_VELOCITY / this.scale);
    }

    //Set direction and speed to pan y.
    //Check if cursor position is outside the top edge of the bounding box.
    if (position.y < box()) {
      //Set the y coord of the panVelocity based on how close to the edge of the screen the cursor is.
      const topPan = Math.floor(
        ((box() - position.y) * MAX_PAN_VELOCITY * 0.01) / this.scale
      );
      //If topPan is > MAX_PAN_VELOCITY, used that instead.
      panVelocity.y =
        topPan <= Math.floor(MAX_PAN_VELOCITY / this.scale)
          ? topPan
          : Math.floor(MAX_PAN_VELOCITY / this.scale);
      //Check if cursor position is outside the bottom edge of the bounding box.
    } else if (position.y > canvasRect.height - box() - mobileAdjust) {
      //Set the y coord of the panVelocity based on how close to the edge of the screen the cursor is.
      const bottomPan = Math.floor(
        ((canvasRect.height - box() - mobileAdjust - position.y) *
          MAX_PAN_VELOCITY *
          0.01) /
          this.scale
      );
      //If bottomPan is > MAX_PAN_VELOCITY, used that instead.
      panVelocity.y =
        bottomPan >= Math.floor(-MAX_PAN_VELOCITY / this.scale)
          ? bottomPan
          : Math.floor(-MAX_PAN_VELOCITY / this.scale);
    }

    //When we stop tracking the current mouse point, we reset panVelocity to 0, 0.
    return this.currentMousePoint !== DEFAULT_MOUSE_POINT
      ? panVelocity
      : { x: 0, y: 0 };
  }

  /**
   * Draws the boundary edges of a user's map using the map's station coordinates.
   * TODO: we might want to factor in the boundaries for the station groups into this too at some point.
   * We might run into situations on the edges of the map where the boundary edge and station group
   * boundary overlap otherwise.
   */
  private drawBoundaryBox(): void {
    //Set to width or height depending on which is longer.
    const screenDimension =
      window.innerWidth > window.innerHeight
        ? window.innerWidth
        : window.innerHeight;

    /* Find corners of map using the min and max canvas points.
    Corners are set using the canvas points of the topmost, leftmost, rightmost and bottommost stations.
    minMapPoint is the topleft corner of the map. maxMapPoint is the bottom right corner of the map. */
    const minMapPoint = this.mapService.getMinCanvasPoint();
    const maxMapPoint = this.mapService.getMaxCanvasPoint();

    /* We will draw each line of the box using the minMapPoint and maxMapPoint
    and then offsetting that using screenDimension and this.boundaryPadding. */
    const leftBoundaryEdge =
      minMapPoint.x -
      (screenDimension * this.scale) / 2 +
      this.boundaryPadding.topLeft;
    const topBoundaryEdge =
      minMapPoint.y -
      (screenDimension * this.scale) / 2 +
      this.boundaryPadding.topLeft;
    const rightBoundaryEdge =
      maxMapPoint.x +
      (screenDimension * this.scale) / 2 -
      this.boundaryPadding.rightBottom;
    const bottomBoundaryEdge =
      maxMapPoint.y +
      (screenDimension * this.scale) / 2 -
      this.boundaryPadding.rightBottom;

    const minBoundaryCoords = { x: leftBoundaryEdge, y: topBoundaryEdge };
    const maxBoundaryCoords = { x: rightBoundaryEdge, y: bottomBoundaryEdge };

    this.mapBoundaryService.drawBox(minBoundaryCoords, maxBoundaryCoords);
  }

  /**
   * Pans the map a given direction based on panVelocity.
   * Used when outside the bounding box and dragging.
   * Used when center button is pressed.
   * Used when a fast drag is initiated.
   * //TODO: Allow use when middle wheel is active.
   *
   * @param panVelocity How much to pan in each direction.
   */
  private autoMapPan(panVelocity: Point): void {
    //Will offset the currentCanvasPoint by panVelocity.
    const xMove = panVelocity.x;
    const yMove = panVelocity.y;

    this.currentCanvasPoint.x -= xMove;
    this.currentCanvasPoint.y -= yMove;

    //If dragging a station, need to offset the station's mapPoint too so that it doesn't get left behind while panning.
    if (this.dragItem === MapDragItem.Station) {
      for (const station of this.stations) {
        if (station.dragging) {
          station.mapPoint.x -= xMove;
          station.mapPoint.y -= yMove;
        }
      }
    }
    this.drawElements();
  }

  /**
   * Determines the point on the canvas that the mouse cursor/pointer is positioned when an event is triggered.
   *
   * @param event The event for the cursor or touch information.
   * @returns An accurate point for the cursor or touch position on the canvas.
   */
  private getEventCanvasPoint(event: MouseEvent | PointerEvent | Touch): Point {
    //Get the dimensions of the canvas element.
    const canvasRect = this.mapCanvas.nativeElement.getBoundingClientRect();
    return {
      //We use Math.floor because we need all coordinates to be integers instead of floats.
      x: Math.floor(event.clientX - canvasRect.left),
      y: Math.floor(event.clientY - canvasRect.top),
    };
  }

  /**
   * Determines the point on the canvas context that the mouse cursor/pointer or touch event is positioned.
   * This adjusts for the pixel ratio in order to report an accurate position when using `context` methods
   * like `isPointInPath` or `isPointInStroke`.
   *
   * @param event The event for the cursor or touch information.
   * @returns An accurate point for the cursor or touch position on the canvas context.
   */
  private getEventContextPoint(
    event: MouseEvent | PointerEvent | Touch
  ): Point {
    //Get the dimensions of the canvas element.
    const canvasPoint = this.getEventCanvasPoint(event);
    return {
      //We use Math.floor because we need all coordinates to be integers instead of floats.
      x: Math.floor(canvasPoint.x * window.devicePixelRatio),
      y: Math.floor(canvasPoint.y * window.devicePixelRatio),
    };
  }

  /**
   * Handles the logic that runs when a pointer, touch and mouse start/down event is registered.
   *
   * @param event Is an input event.
   */
  private eventStartLogic(event: MouseEvent | Touch) {
    //Gets the position of the cursor.
    const eventCanvasPoint = this.getEventCanvasPoint(event);
    //Gets the position of the cursor and multiplies it by the pixel ratio of the screen.
    const eventContextPoint = this.getEventContextPoint(event);

    //Check if there is an auto pan loop going on.
    if (this.panActive) {
      //Cancel the loop and reset related properties.
      cancelAnimationFrame(this.myReq as number);
      this.panActive = false;
      this.fastDrag = false;
      this.mapService.centerActive$.next(false);
      this.mapService.centerPanVelocity$.next({ x: 0, y: 0 });
      this.mapService.centerCount$.next(0);
      this.nextPanVelocity = { x: 0, y: 0 };
    }

    //If there is a station option menu open, close it.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }

    //In build mode, there are things that can be clicked that cant be clicked in view mode.
    if (this.mapMode === MapMode.Build) {
      //Loop through the stations array to check if there is a station being interacted with.
      for (const station of this.stations) {
        // Check if clicked on an interactive station element. This sets the station.hoverActive to wherever the mouse is.
        station.checkElementHover(eventCanvasPoint, this.mapMode, this.scale);
        // If clicked on a connection node, set properties so that we can begin a drag from it. Then break the for loop.
        if (station.hoverItem === StationElementHoverItem.Node) {
          station.dragging = true;
          this.dragItem = MapDragItem.Node;
          break;
          // If clicked on a station outside the connection node, set properties so we can drag it. Then break the for loop.
        } else if (station.hoverItem !== StationElementHoverItem.None) {
          station.dragging = true;
          if (this.dragItem !== MapDragItem.Node) {
            this.dragItem = MapDragItem.Station;
          }
          break;
        }
      }

      //If a station or node is being dragged, we should not check for hover on a connection.
      if (
        this.dragItem !== MapDragItem.Node &&
        this.dragItem !== MapDragItem.Station
      ) {
        //Loop through the connections array to check if there is a station being interacted with.
        for (const connection of this.connections) {
          // Check if connection line was clicked. eventContextPoint is used for connection lines. Sets connection.hoverActive to true.
          connection.checkElementHover(eventContextPoint, this.context);
          //Find the connection line that was clicked on.
          if (connection.hovering) {
            //Get the station that starts the connection line.
            const startStation = this.stations.find(
              (station) => station.rithmId === connection.startStationRithmId
            );
            if (!startStation) {
              throw new Error(
                `Unable to find a start station with the id of ${connection.startStationRithmId} for a connection`
              );
            }
            //Set appropriate properties that allow a connection line to be dragged.
            startStation.dragging = true;
            this.dragItem = MapDragItem.Connection;
            break;
          }
        }
      }

      //This ensures that when dragging a station or node connection, it will always display above other stations.
      //Find the station that is being dragged.
      if (this.stations.find((obj) => obj.dragging === true)) {
        //Isolate that station from array.
        const draggingStation = this.stations.filter(
          (obj) => obj.dragging === true
        );
        //Remove the station from the stations array.
        this.stations = this.stations.filter((obj) => obj.dragging !== true);
        //Put that station in the back of the stations array.
        this.stations.push(draggingStation[0]);
      }
    }

    //If user didn't click on a station, etc than they must have clicked on the map.
    if (this.dragItem === MapDragItem.Default) {
      this.dragItem = MapDragItem.Map;
    }
  }

  /**
   * Handles the logic that runs when a pointer, touch and mouse up/end event is registered.
   *
   * @param event Is a mouse or touch event.
   */
  private eventEndLogic(event: MouseEvent | Touch) {
    //Gets the position of the cursor.
    const eventCanvasPoint = this.getEventCanvasPoint(event);
    //Gets the position of the cursor and multiplies it by the pixel ratio of the screen.
    const eventContextPoint = this.getEventContextPoint(event);
    //Set this to false so that if a fast drag has been activated it doesn't get cancelled.
    this.holdDrag = false;

    // If there is a station option menu open, close it.
    if (this.mapService.matMenuStatus$ && this.mapMode === MapMode.Build) {
      this.mapService.matMenuStatus$.next(true);
    }

    /* Check if event was a click and not a drag.

    We have to manually check this because we can't use a click event in map-canvas.
    The problem is that if you drag and happen to end your drag over anything that is watching for a click event,
    the event will trigger. This is a result of the internal logic of click events,
    which only watch to see if your click is in the same element when you lift your finger.
    That doesn't work with our canvas, which is a giant element.

    Instead of using a click event, we have an if check that better simulates click events.
    This checks to see if you lift your finger in just about the same area as where you started a click.
    This prevents weird issues with dragging.

    There is some give, represented by TOUCH_EVENT_MARGIN,
    that still considers an event a click if it is within a few pixels of where it started.
    This allows users to be a little less precise. */
    if (
      Math.abs(eventCanvasPoint.x - this.eventStartCoords.x) <
        TOUCH_EVENT_MARGIN &&
      Math.abs(eventCanvasPoint.y - this.eventStartCoords.y) <
        TOUCH_EVENT_MARGIN
    ) {
      //Reset properties that were changed by the event.
      this.dragItem = MapDragItem.Default;
      this.stations.forEach((station) => {
        station.dragging = false;
      });
      //If the scale of the map is big enough to display station elements.
      if (this.scale >= SCALE_RENDER_STATION_ELEMENTS) {
        //Trigger the logic that takes place after a simulated 'click'.
        this.clickEventHandler(eventCanvasPoint, eventContextPoint);
      }
      //Resetting the current mouse point to -1, -1. This tells our code we're no longer tracking the mouse point.
      this.mapService.currentMousePoint$.next(DEFAULT_MOUSE_POINT);
      //Don't run any of the rest of the method's code.
      return;
    }

    //If dragging the map.
    if (this.dragItem === MapDragItem.Map) {
      //Check if nextPanVelocity is great enough to trigger autoPan, this is considered and referred to as a "fast drag".
      if (this.fastDrag) {
        //Adjust the pan velocity by scale. It should pan faster when zoomed out.
        this.nextPanVelocity = {
          x: this.nextPanVelocity.x / this.scale,
          y: this.nextPanVelocity.y / this.scale,
        };
        this.checkAutoPan();
      } else {
        //If not a fast drag, reset nextPanVelocity. This makes sure that a pan doesn't trigger auto pan when it shouldn't.
        this.nextPanVelocity = { x: 0, y: 0 };
      }
    }

    //If dragging a connection node or moving a connection to a different station.
    if (
      this.dragItem === MapDragItem.Node ||
      this.dragItem === MapDragItem.Connection
    ) {
      //Declare variables.
      let newNextStation: StationMapElement | undefined;
      let newPreviousStation: StationMapElement | undefined;
      //Loop through stations to check which station the mouse was over.
      for (const station of this.stations) {
        // Check if clicked on an interactive station element.
        station.checkElementHover(eventCanvasPoint, this.mapMode, this.scale);
        //If there was a station being hovered over set that to newNextStation.
        if (station.hoverItem !== StationElementHoverItem.None) {
          newNextStation = station;
          //Set newPreviousStation to the station with dragging set to true.
          newPreviousStation = this.stations.find(
            (foundStation) => foundStation.dragging
          );
          break;
        }
      }
      //If a user attempted to change a connection line, but wasn't hovering over a new station.
      if (!newNextStation && this.dragItem === MapDragItem.Connection) {
        if (this.storedConnectionLine === null) {
          throw new Error('The connection line was not stored!');
        }
        //Run the logic to reset the connection line and reset properties.
        this.restoreConnection();
        this.connections.push(this.storedConnectionLine);
        this.storedConnectionLine = null;
      }

      //If a new connection was set properly.
      if (newNextStation && newPreviousStation) {
        //Loop through stations to check which station the mouse was over.
        for (const station of this.stations) {
          // Check if clicked on an interactive station element.
          station.checkElementHover(eventCanvasPoint, this.mapMode, this.scale);
          //If the mouse was over a station.
          if (station.hoverItem !== StationElementHoverItem.None) {
            /*ensure we cant get duplicate ids by making sure there wasn't
            already a connection between the starting and ending stations. */
            if (
              !station.previousStations.includes(newPreviousStation.rithmId) &&
              station.rithmId !== newPreviousStation.rithmId
            ) {
              //If the stations have rithmIds set. This is a check to make sure we don't have bad data.
              if (
                newPreviousStation.rithmId.length > 0 &&
                newNextStation.rithmId.length > 0
              ) {
                //Add the new previous station the the array.
                station.previousStations.push(newPreviousStation.rithmId);
              }
            }
            //If the station isn't new, it will now be set as updated.
            station.markAsUpdated();
          }
          //Find the station that user was dragging from.
          if (station.dragging) {
            /*ensure we cant get duplicate ids by making sure there wasn't
            already a connection between the starting and ending stations. */
            if (
              !station.nextStations.includes(newNextStation.rithmId) &&
              station.rithmId !== newNextStation.rithmId
            ) {
              //If the stations have rithmIds set. This is a check to make sure we don't have bad data.
              if (
                newPreviousStation.rithmId.length > 0 &&
                newNextStation.rithmId.length > 0
              ) {
                //Add the new next station to the array.
                station.nextStations.push(newNextStation.rithmId);
              }
            }
          }
        }

        //Create a new connection element using the newPreviousStation and newNextStation.
        const lineInfo: ConnectionMapElement = new ConnectionMapElement(
          newPreviousStation,
          newNextStation,
          this.scale
        );

        /* Check that there isn't already an existing connection line with the same data as
        lineInfo. Also check that lineInfo isn't a station attempting to connect to itself. */
        if (
          !this.mapService.connectionElements
            .map((e) => JSON.stringify(e))
            .includes(JSON.stringify(lineInfo)) &&
          newPreviousStation.rithmId !== newNextStation.rithmId
        ) {
          //Add lineInfo to the array of connections.
          this.mapService.connectionElements.push(lineInfo);
          // Set storedConnectionLine to null to avoid restoring it to previous state once it's moved successfully.
          if (this.storedConnectionLine) {
            this.storedConnectionLine = null;
          }
        }
        /* If storedConnectionLine hasn't been reset to null by now,
        that means that we need it to restore a removed connection line. */
        if (this.storedConnectionLine) {
          //Run the logic to reset the connection line and reset properties.
          this.restoreConnection();
          this.mapService.connectionElements.push(this.storedConnectionLine);
          this.storedConnectionLine = null;
        }
      }
    }

    //Reset properties.
    this.mapService.currentMousePoint$.next(DEFAULT_MOUSE_POINT);
    this.dragItem = MapDragItem.Default;
    this.stations.forEach((station) => {
      //ensure no station has decimals in their coordinates.
      station.mapPoint.x = Math.floor(station.mapPoint.x);
      station.mapPoint.y = Math.floor(station.mapPoint.y);

      //Update stations after we're done with them.
      if (station.dragging) {
        station.dragging = false;
        station.markAsUpdated();
        this.drawElements();
      }
    });

    //Reset properties.
    this.eventStartCoords = DEFAULT_MOUSE_POINT;
    this.lastTouchCoords = [DEFAULT_MOUSE_POINT];
    this.mapCanvas.nativeElement.style.cursor = 'default';
    this.connectionLineDrag = false;
  }

  /**
   * Handles the logic that runs when a pointer, touch and mouse move event is registered.
   *
   * @param event Is an input event.
   */
  private singleInputMoveLogic(event: PointerEvent | MouseEvent | Touch) {
    //Gets the position of the cursor.
    const eventCanvasPoint = this.getEventCanvasPoint(event);
    //Gets the position of the cursor and multiplies it by the pixel ratio of the screen.
    const eventContextPoint = this.getEventContextPoint(event);

    //Track how much the cursor has moved since it was last tracked.
    const moveAmountX = this.lastTouchCoords[0].x - eventCanvasPoint.x;
    const moveAmountY = this.lastTouchCoords[0].y - eventCanvasPoint.y;

    //If dragging the map.
    if (this.dragItem === MapDragItem.Map) {
      //Set cursor style
      this.mapCanvas.nativeElement.style.cursor = 'move';
      //Adjust the currentCanvasPoint by tracked movement, adjusted for scale.
      this.currentCanvasPoint.x += moveAmountX / this.scale;
      this.currentCanvasPoint.y += moveAmountY / this.scale;
      //Set the cursor tracking to current position.
      this.lastTouchCoords[0] = eventCanvasPoint;
      //Prepare for a fast drag by setting nextPanVelocity to -moveAmount.
      this.nextPanVelocity = { x: -moveAmountX, y: -moveAmountY };
      //We only want to actually trigger the fast drag if nextPanVelocity is high enough.
      if (
        Math.abs(this.nextPanVelocity.x) > PAN_TRIGGER_LIMIT ||
        Math.abs(this.nextPanVelocity.y) > PAN_TRIGGER_LIMIT
      ) {
        this.fastDrag = true;
        this.holdDrag = true;
        /* This is designed to trigger if a move event is ongoing.
        It wont have a chance to trigger if the event has ended already
        because this.holdDrag will be set to false by the time the timeout triggers.
        If we're in the middle of a move event we don't want to auto pan the map yet
        so we reset the properties that would trigger it.*/
        setTimeout(() => {
          if (this.holdDrag) {
            this.fastDrag = false;
            this.nextPanVelocity = { x: 0, y: 0 };
          }
        }, 100);
      }

      //If dragging a station.
    } else if (this.dragItem === MapDragItem.Station) {
      //Loop through stations to find the station that is being dragged.
      for (const station of this.stations) {
        if (station.dragging) {
          //set mousePoint to the tracked cursor position.
          this.mapService.currentMousePoint$.next(eventCanvasPoint);
          //Set cursor style.
          this.mapCanvas.nativeElement.style.cursor = 'grabbing';

          //Adjust the station's mapPoint by tracked movement, adjusted for scale.
          station.mapPoint.x -= moveAmountX / this.scale;
          station.mapPoint.y -= moveAmountY / this.scale;

          //Set the cursor tracking to current position.
          this.lastTouchCoords[0] = eventCanvasPoint;
        }
      }

      //If dragging a node.
    } else if (this.dragItem === MapDragItem.Node) {
      //Set cursor style.
      this.mapCanvas.nativeElement.style.cursor = 'grabbing';
      //Loop through stations to find the station whose node is being dragged.
      for (const station of this.stations) {
        // Check if hovering over an interactive station element.
        station.checkElementHover(
          this.mapService.currentMousePoint$.value,
          this.mapMode,
          this.scale
        );
        if (station.dragging) {
          //set mousePoint to the tracked cursor position. This allows us to draw a line from the node to the cursor.
          this.mapService.currentMousePoint$.next(eventCanvasPoint);
        }
      }

      //If adding a new connected station.
    } else if (
      this.mapMode === MapMode.StationAdd &&
      this.mapService.stationElements.some((e) => e.isAddingConnected)
    ) {
      //set mousePoint to the tracked cursor position. This allows us to draw a line from the node to the cursor.
      this.mapService.currentMousePoint$.next(eventCanvasPoint);

      //If dragging a previously created connection line.
    } else if (this.dragItem === MapDragItem.Connection) {
      //Loop through stations to check if a station is being hovered over.
      for (const station of this.stations) {
        station.checkElementHover(
          this.mapService.currentMousePoint$.value,
          this.mapMode,
          this.scale
        );
      }

      //If it is a drag and not a click. See comment in eventEndLogic for why we check for this.
      const moveFromStartX = this.eventStartCoords.x - eventCanvasPoint.x;
      const moveFromStartY = this.eventStartCoords.y - eventCanvasPoint.y;
      if (
        Math.abs(moveFromStartX) > MOUSE_MOVEMENT_OVER_CONNECTION ||
        Math.abs(moveFromStartY) > MOUSE_MOVEMENT_OVER_CONNECTION
      ) {
        //Run logic for dragging a previously existing connection.
        this.onConnectionDrag();
      }

      //If a connection is being dragged.
      if (this.connectionLineDrag) {
        //Set cursor style.
        this.mapCanvas.nativeElement.style.cursor = 'grabbing';
        if (this.stations.some((station) => station.dragging)) {
          //set mousePoint to the tracked cursor position. This allows us to draw a line from the node to the cursor.
          this.mapService.currentMousePoint$.next(eventCanvasPoint);
        }
      }

      /* This is where we check to see if a station, group or connection line is being hovered,
    and nothing is currently being dragged. */
    } else {
      // Only trigger when station elements are visible.
      if (this.scale >= SCALE_RENDER_STATION_ELEMENTS) {
        //Check if hovering over different station elements.
        for (const station of this.stations) {
          station.checkElementHover(eventCanvasPoint, this.mapMode, this.scale);
          //If cursor is hovering over a part of a station.
          if (station.hoverItem !== StationElementHoverItem.None) {
            //If the user is not in view mode, and they're hovering over a station button or node.
            if (
              !(
                this.mapMode === MapMode.View &&
                (station.hoverItem === StationElementHoverItem.Button ||
                  station.hoverItem === StationElementHoverItem.Node)
              )
            ) {
              //Set cursor style.
              this.mapCanvas.nativeElement.style.cursor = 'pointer';
            }

            //If the user is in build mode.
            if (this.mapMode === MapMode.Build) {
              //Set cursor style.
              this.mapCanvas.nativeElement.style.cursor = 'pointer';
            }
            break;
            //If the user is not hovering over a station.
          } else {
            //Set cursor style.
            this.mapCanvas.nativeElement.style.cursor = 'default';
          }
        }

        //Ensure that while a station is being hovered a connection line is not.
        //True if currently hovering over a station.
        const hoveringOverStation = this.stations.some(
          (station) => station.hoverItem !== StationElementHoverItem.None
        );
        //True if currently hovering over a group.
        const hoveringOverStationGroup = this.stationGroups.some(
          (stationGroup) =>
            stationGroup.hoverItem !== StationGroupElementHoverItem.None
        );
        //If not hovering over a station or group.
        if (!hoveringOverStation && !hoveringOverStationGroup) {
          /*Set all connections hoverActive status to false.
          This ensures only one connection line can be hovered at a time. */
          this.connections.map((con) => {
            con.hovering = false;
          });
          //Loop through connections to check if there is a connection being hovered over.
          for (const connection of this.connections) {
            connection.checkElementHover(eventContextPoint, this.context);
            //Find the hovered connection.
            if (connection.hovering) {
              //Set cursor style.
              this.mapCanvas.nativeElement.style.cursor = 'pointer';
              break;
            } else {
              //If no connections are being hovered over.
              this.mapCanvas.nativeElement.style.cursor = 'default';
            }
          }
        }
        //Ensure that while a station or connection is being hovered a station group is not.
        //True if currently hovering over a connection.
        const hoveringOverConnection = this.connections.some(
          (con) => con.hovering
        );
        //If not hovering over a station or connection, and the mapmode is StationGroupAdd or View.
        if (
          !hoveringOverStation &&
          !hoveringOverConnection &&
          (this.mapMode === MapMode.StationGroupAdd ||
            this.mapMode === MapMode.View)
        ) {
          /*Set all group hoverActive status to None.
          This ensures only one group can be hovered at a time. */
          this.stationGroups.map((fl) => {
            fl.hoverItem = StationGroupElementHoverItem.None;
          });
          //Loop through groups to check if there is a group being hovered over.
          for (const stationGroup of this.stationGroups) {
            stationGroup.checkElementHover(
              eventContextPoint,
              eventCanvasPoint,
              this.context,
              this.scale
            );
            //If cursor is over a group boundary.
            if (
              stationGroup.hoverItem ===
                StationGroupElementHoverItem.Boundary ||
              stationGroup.hoverItem === StationGroupElementHoverItem.Name
            ) {
              //Set cursor style.
              this.mapCanvas.nativeElement.style.cursor = 'pointer';
              break;
            } else {
              //If no group is being hovered over.
              this.mapCanvas.nativeElement.style.cursor = 'default';
            }
          }
        }

        //If hovering of a station.
        if (hoveringOverStation) {
          //disable hover on connections and station group.
          this.connections.map((con) => (con.hovering = false));
          this.stationGroups.map(
            (stationGroup) =>
              (stationGroup.hoverItem = StationGroupElementHoverItem.None)
          );
        }
      }
    }

    /* while panActive is true, don't trigger draw elements,
    we'll draw with checkAutoPan instead.
    This is to help with performance. Drawing too often creates lag. */
    if (!this.panActive) {
      this.drawElements();
    }
  }

  /**
   * Logic for handling pinch to zoom on a mobile device.
   *
   * @param position An array of points representing your two fingers.
   */
  private pinchZoomLogic(position: Point[]) {
    //Set the distance between your two fingers when you initiated a pinch.
    const xBeginDiff = Math.abs(
      this.lastTouchCoords[0].x - this.lastTouchCoords[1].x
    );
    const yBeginDiff = Math.abs(
      this.lastTouchCoords[0].y - this.lastTouchCoords[1].y
    );

    //Set the current distance between your two fingers.
    const xCurrentDiff = Math.abs(position[0].x - position[1].x);
    const yCurrentDiff = Math.abs(position[0].y - position[1].y);
    //Average the beginning distance for the y coord and x coord.
    const averageStart = Math.floor((xBeginDiff + yBeginDiff) / 2);
    //Average the current distance for the y coord and x coord.
    const averageEnd = Math.floor((xCurrentDiff + yCurrentDiff) / 2);
    //Average the start and end y and x coords.
    const averageDiff = Math.floor(
      (xCurrentDiff - xBeginDiff + (yCurrentDiff - yBeginDiff)) / 2
    );

    //Find the middle point between your two fingers.
    const middlePoint = {
      x: (position[0].x + position[1].x) / 2,
      y: (position[0].y + position[1].y) / 2,
    };

    //If there is more distance between your fingers than when you started.
    if (averageEnd > averageStart) {
      // Zoom in
      // Update lastTouchCoords with current position of fingers.
      this.lastTouchCoords = position;
      //Update zoomCount by adding the average difference.
      this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
      //Call handleZoom with pinch set to true, and zoom at the centerPoint.
      this.mapService.handleZoom(true, middlePoint);
      //If there is less distance between your fingers than when you started.
    } else if (averageEnd < averageStart) {
      // Zoom out
      // Update lastTouchCoords with current position of fingers.
      this.lastTouchCoords = position;
      //Update zoomCount by adding the average difference.
      this.mapService.zoomCount$.next(this.zoomCount + averageDiff);
      //Call handleZoom with pinch set to true, and zoom at the centerPoint.
      this.mapService.handleZoom(true, middlePoint);
    }
  }

  /**
   * Handle simulated click events. See note in eventEndLogic regarding why we simulate a click event.
   *
   * @param point The position of mouse click event.
   * @param contextPoint Calculated position of click.
   */
  private clickEventHandler(point: Point, contextPoint: Point) {
    //Add station.
    if (this.mapMode === MapMode.StationAdd) {
      //Set coords where new station will be placed.
      const coords: Point = { x: 0, y: 0 };
      //Place middle of station where clicked.
      coords.x = Math.floor(point.x - (STATION_WIDTH / 2) * this.scale);
      coords.y = Math.floor(point.y - (STATION_HEIGHT / 2) * this.scale);

      //create a new station at click.
      this.mapService.createNewStation(coords);

      //After clicking, set to build mode.
      this.mapService.mapMode$.next(MapMode.Build);
      return;
    }

    //Check if click was in a station. If so any code below this for loop will not run.
    for (const station of this.stations) {
      //Connection node.
      if (station.isPointInConnectionNode(point, this.mapMode, this.scale)) {
        /* TODO: Add functionality to allow clicking a node.
        You would then click on a station to create a new connection instead of dragging. */
        return;

        //Option Button.
      } else if (
        station.isPointInOptionButton(point, this.mapMode, this.scale)
      ) {
        //set mousePoint to the tracked cursor position.
        this.mapService.currentMousePoint$.next(point);
        //Note which station was clicked so we can open the option menu for the correct station.
        this.mapService.stationButtonClick$.next({
          click: true,
          data: station,
        });
        return;

        //Document badge. Cannot click on a document Badge for a new station.
      } else if (
        station.isPointInDocumentBadge(point, this.mapMode, this.scale) &&
        station.status !== MapItemStatus.Created
      ) {
        //open documents modal for clicked station.
        this.dialog.open(StationDocumentsModalComponent, {
          minWidth: '370px',
          data: {
            stationName: station.stationName,
            stationId: station.rithmId,
          },
        });
        return;

        //station itself.
      } else if (station.isPointInStation(point, this.mapMode, this.scale)) {
        //If clicking on station to add it to a group.
        if (this.mapMode === MapMode.StationGroupAdd) {
          //If the station is clickable.
          if (!station.disabled) {
            //Toggle whether a station is selected to be added to the station group or not.
            station.selected = !station.selected;
          }
          return;
        } else {
          //run logic for when a station is clicked on.
          this.checkStationClick(station);
          return;
        }
      }
    }
    /* Check if click was on a connection line.
    This line placed after station for loop to not trigger
    a connection click while clicking a station. */
    this.checkConnectionClick(contextPoint);

    //Check if click was on a station group boundary.
    this.checkStationGroupClick(contextPoint, point);
  }

  /**
   * Restores the connection line to previous state if something fails while moving current connection line.
   */
  private restoreConnection(): void {
    if (this.storedConnectionLine === null) {
      throw new Error('The connection line was not stored!');
    }
    //Loop through stationElements to find a station with same rithmId as storedConnectionLine.startStationRithmId.
    const startStation = this.mapService.stationElements.find(
      (station) =>
        station.rithmId === this.storedConnectionLine?.startStationRithmId
    );
    if (!startStation) {
      throw new Error(`Start station ${this.storedConnectionLine.startStationRithmId} was
      not found when trying to restore a station`);
    }
    //Loop through stationElements to find a station with same rithmId as storedConnectionLine.endStationRithmId.
    const endStation = this.mapService.stationElements.find(
      (station) =>
        station.rithmId === this.storedConnectionLine?.endStationRithmId
    );
    if (!endStation) {
      throw new Error(
        `End station ${this.storedConnectionLine.endStationRithmId} was not found when trying to restore a station`
      );
    }

    //Restore the end and start station to their respective nextStation and previousStation arrays.
    startStation.nextStations.push(this.storedConnectionLine.endStationRithmId);
    endStation.previousStations.push(
      this.storedConnectionLine.startStationRithmId
    );
  }

  /**
   * Handles user input on a clicked connection line.
   *
   * @param contextPoint Calculated position of click.
   */
  checkConnectionClick(contextPoint: Point): void {
    //Loop through connections to find the connection that was clicked.
    for (const connectionLine of this.connections) {
      connectionLine.checkElementHover(contextPoint, this.context);
      if (connectionLine.hovering) {
        //Open the connection info drawer.
        this.sidenavDrawerService.openDrawer('connectionInfo', connectionLine);
        break;
      }
    }
  }

  /**
   * Handles user input on a clicked station group.
   *
   * @param contextPoint Calculated position of click.
   * @param canvasPoint Calculated position of click.
   */
  checkStationGroupClick(contextPoint: Point, canvasPoint: Point): void {
    //Loop through groups to find the group that was clicked.
    for (const stationGroup of this.stationGroups) {
      stationGroup.checkElementHover(
        contextPoint,
        canvasPoint,
        this.context,
        this.scale
      );
      if (this.mapMode === MapMode.StationGroupAdd) {
        //If the cursor is over the group boundary and the group is not disabled.
        if (
          stationGroup.hoverItem === StationGroupElementHoverItem.Boundary &&
          !stationGroup.disabled
        ) {
          stationGroup.selected = !stationGroup.selected;
          break;
        }
      } else if (this.mapMode === MapMode.View) {
        //If map mode is view, then should open station group info drawer.
        if (
          stationGroup.hoverItem === StationGroupElementHoverItem.Boundary ||
          stationGroup.hoverItem === StationGroupElementHoverItem.Name
        ) {
          this.sidenavDrawerService.toggleDrawer('stationGroupInfo');
          break;
        }
      }
    }
  }
  // checkStationGroupClick(contextPoint: Point): void {
  //   //Loop through groups to find the group that was clicked.
  //   for (const stationGroup of this.stationGroups) {
  //     stationGroup.checkElementHover(contextPoint, this.context);
  //     //If the cursor is over the group boundary and the group is not disabled.
  //     if (
  //       stationGroup.hoverItem === StationGroupElementHoverItem.Boundary &&
  //       !stationGroup.disabled
  //     ) {
  //       stationGroup.selected = !stationGroup.selected;
  //       break;
  //     }
  //   }
  // }

  /**
   * Handles when a user drags an existing connection line.
   *
   */
  onConnectionDrag(): void {
    //Loop through connections to find connection with hoveractive = true.
    for (const connectionLine of this.connections) {
      //If there is a connection is being dragged.
      if (connectionLine.hovering && !this.connectionLineDrag) {
        //Find the start and end stations of the connection.
        const startStation = this.stations.find(
          (station) => station.rithmId === connectionLine.startStationRithmId
        );
        const endStation = this.stations.find(
          (station) => station.rithmId === connectionLine.endStationRithmId
        );
        if (!startStation || !endStation) {
          throw new Error('This start or end station was not found.');
        }
        //Store the connection in case moving the connection gets cancelled.
        this.storedConnectionLine = new ConnectionMapElement(
          startStation,
          endStation,
          this.scale
        );
        //Remove the connection from the array.
        this.mapService.removeConnectionLine(
          connectionLine.startStationRithmId,
          connectionLine.endStationRithmId
        );
        //note that you are dragging a connection.
        this.connectionLineDrag = true;
        break;
      }
    }
  }

  /**
   * Handles user input on a clicked station.
   *
   * @param station The clicked station.
   */
  checkStationClick(station: StationMapElement): void {
    //declare variable for later.
    const stationDataInfo: StationInformation = {
      rithmId: station.rithmId,
      name: '',
      instructions: '',
      nextStations: [],
      previousStations: [],
      stationOwners: [],
      workers: [],
      createdByRithmId: '',
      createdDate: '',
      updatedByRithmId: '',
      updatedDate: '',
      questions: [],
      priority: 1,
    };
    //set this variable to use the information from passed in station, except use stationDataInfo for stationRithmId.
    const dataInformationDrawer: StationInfoDrawerData = {
      stationRithmId: stationDataInfo.rithmId,
      stationName: station.stationName,
      editMode: this.mapMode === MapMode.Build,
      stationStatus: station.status,
      mapMode: this.mapMode,
      openedFromMap: true,
      notes: station.notes,
    };
    //Use dataInformationDrawer to open the station info drawer.
    this.sidenavDrawerService.openDrawer('stationInfo', dataInformationDrawer);
    //update station name.
    this.stationService.updatedStationNameText(station.stationName);
  }
}
