import { Component, Input, OnInit } from '@angular/core';
/**
 * Loading indicator component.
 *
 * Set class="loader" *ngIf="isLoading" when implementing.
 */
@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent implements OnInit {
  /** A custom diameter property. */
  @Input() diameter = 100;

  /** Setting this property changes LoadingIndicatorComponent to be inline. */
  @Input() inlineText?: string;

  /**
   * Sets diameter to 18 if inline.
   */
  ngOnInit(): void {
    if (this.inlineText) {
      this.diameter = 18;
    }
  }
}
