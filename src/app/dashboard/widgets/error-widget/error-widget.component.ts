import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Component for show error.
 */
@Component({
  selector: 'app-error-widget[errorMessage][permission]',
  templateUrl: './error-widget.component.html',
  styleUrls: ['./error-widget.component.scss'],
})
export class ErrorWidgetComponent {
  /** Show message error. */
  @Input() errorMessage!: string;

  /** Validate if user have permissions. */
  @Input() permission = false;

  /** Show message for delete widget. */
  @Input() widgetDeleted = false;

  /** Output try again. */
  @Output() tryAgain = new EventEmitter();

  /** Output try again. */
  @Output() deleteWidget = new EventEmitter();

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  constructor(private sidenavDrawerService: SidenavDrawerService) {}
  /**
   * Try again.
   */
  reloadRequest(): void {
    this.tryAgain.emit();
  }

  /**
   * Delete widget.
   */
  removeWidget(): void {
    this.deleteWidget.emit();
  }
}
