import { Component } from '@angular/core';
/**
 * Reusable component for displaying an headline-widget in station grid.
 */
@Component({
  selector: 'app-headline-widget',
  templateUrl: './headline-widget.component.html',
  styleUrls: ['./headline-widget.component.scss'],
})
export class HeadlineWidgetComponent {
  /** Headline text for the widget. */
  public headlineText = 'Form Title';

  constructor() {
    /** */
  }
}
