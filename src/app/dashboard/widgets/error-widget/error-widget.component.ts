import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  /** Output try again. */
  @Output() tryAgain = new EventEmitter();

  /**
   * Try again.
   */
  reloadRequest(): void {
    this.tryAgain.emit();
  }
}
