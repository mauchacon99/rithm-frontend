import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StationMapElement } from 'src/helpers';
import { MapMode, Point, } from 'src/models';
import { STATION_HEIGHT, STATION_WIDTH } from '../map-constants';
import { MapService } from '../map.service';
import { StationElementService } from '../station-element.service';

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

  /** The rendering context for the canvas element for the map. */
  private context!: CanvasRenderingContext2D;

  /** Modes for canvas element used for the map. */
  mapMode = MapMode.view;

  /** Destroyed. */
  private destroyed$ = new Subject();

  /**
   * Add station mode active.
   *
   * @returns Boolean.
   */
  get stationAddActive(): boolean {
    return this.mapMode === MapMode.stationAdd;
  }

  /** Data for station card used in the map. */
  stations: StationMapElement[] = [];

  constructor(
    private mapService: MapService,
    private stationElementService: StationElementService
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
      }, (error: unknown) => {
        throw new Error(`Map overlay subscription error: ${error}`);
      });
    });
  }

  /**
   * Scales the canvas and does initial draw for elements.
   */
  ngOnInit(): void {
    this.context = this.mapCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.mapService.registerCanvasContext(this.context);

    this.useStationData();
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mouseDown(event: MouseEvent): void {
    // TODO: Handle behavior when mouse is pressed
  }

  /**
   * Handles user input when a mouse button is released. Used for placing dragged elements.
   *
   * @param event The mouseup event that was triggered.
   */
  @HostListener('mouseup', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mouseUp(event: MouseEvent): void {
    // TODO: Handle behavior when mouse button is released
  }

  /**
   * Handles user input when a mouse cursor is moved. Used for calculating dragged element movement, or map pan drag.
   *
   * @param event The mousemove event that was triggered.
   */
  @HostListener('mousemove', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mouseMove(event: MouseEvent): void {
    // TODO: Handle behavior when mouse is moved
  }

  /**
   * Handles user input when a mouse button is clicked. Used for clicking on elements.
   *
   * @param event The click event that was triggered.
   */
  @HostListener('click', ['$event'])
  click(event: MouseEvent): void {
    if (this.mapMode === MapMode.stationAdd) {
      //Create new station object using coordinates from the click.
      const coords = this.getMouseCanvasPoint(event);
      coords.x = coords.x - STATION_WIDTH/2;
      coords.y = coords.y - STATION_HEIGHT/2;

      //create a new station at click.
      const newStation = this.mapService.createNewStation(coords);

      //Add new station to mapElements behavior subject.
      this.mapService.mapElements$.next([...this.stations, newStation]);
      //After clicking, set to build mode.
      this.mapService.mapMode$.next(MapMode.build);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  wheel(event: WheelEvent): void {
    // TODO: Handle behavior when mouse wheel is scrolled
  }

  /**
   * Converts station data so it can be drawn on the canvas.
   */
  private useStationData(): void {
    this.mapService.mapElements$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((stations) => {
      this.stations = stations.map((e) => new StationMapElement(e));
      this.setCanvasSize();
      this.drawElements();
    }, (error: unknown) => {
      throw new Error(`Map service error: ${error}`);
    });
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

      // Draw the stations
      this.stations.forEach((station) => {
        this.stationElementService.drawStation(station, this.mapMode);
      });

      // Draw the flows
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
   * Cleans up subscription.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
