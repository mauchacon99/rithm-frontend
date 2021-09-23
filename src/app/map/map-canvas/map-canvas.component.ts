import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Point } from 'src/models';
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
export class MapCanvasComponent implements OnInit {

  /** The rendering context for the canvas element for the map. */
  private context!: CanvasRenderingContext2D;

  /** Reference to the main canvas element used for the map. */
  @ViewChild('map', { static: true }) private mapCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private mapService: MapService,
    private stationElementService: StationElementService
  ) {}

  /**
   * Scales the canvas and does initial draw for elements.
   */
  ngOnInit(): void {
    this.context = this.mapCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.mapService.registerCanvasContext(this.context);

    this.setCanvasSize();
    this.drawElements();
  }

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  click(event: MouseEvent): void {
    // TODO: Handle behavior when mouse is clicked
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
   * Draws all the elements on the canvas.
   */
  private drawElements(): void {
    requestAnimationFrame(() => {
      /* important! for alignment, you should make things
       * relative to the canvas' current width/height.
       * You can't simply resize the canvas through css.
       */
      this.context.canvas.width = window.innerWidth;
      this.context.canvas.height = window.innerHeight;

      // Clear the canvas
      this.context.clearRect(0, 0, this.mapCanvas.nativeElement.width, this.mapCanvas.nativeElement.height);

      // Calculate the station canvas points

      // Draw the connections

      // Draw the stations
      // this.stationElementService.drawStation();

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
}
