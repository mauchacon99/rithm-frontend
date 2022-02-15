import { Component, Input } from '@angular/core';

/**
 * Component for show error.
 */
@Component({
  selector: 'app-error-widget[errorMessage]',
  templateUrl: './error-widget.component.html',
  styleUrls: ['./error-widget.component.scss'],
})
export class ErrorWidgetComponent {
  /** Show message error. */
  @Input() errorMessage!: string;
}
