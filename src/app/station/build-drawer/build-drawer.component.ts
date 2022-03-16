import { Component, Output, EventEmitter } from '@angular/core';
/**
 *
 */
@Component({
  selector: 'app-build-drawer',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent {
  /** Event Emitter that executes toggle logic from station component. */
  @Output() toggleDrawer: EventEmitter<unknown> = new EventEmitter();

  /** Build Categories. */
  buildCategories: string[] = [
    'Form Inputs',
    'Previous Fields',
    'Components',
    'Integrations',
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * Function to handle Close Drawer button.
   */
  handleCloseDrawer(): void {
    this.toggleDrawer.emit();
  }
}
