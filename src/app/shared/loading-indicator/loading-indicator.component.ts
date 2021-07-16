import { Component, Input, OnInit } from '@angular/core';
/**
 * Loading indicator component.
 *
 * Set class="loader" *ngIf="isLoading" when implementing.
 */
@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent implements OnInit{
  /** A custom diameter property. */
  @Input() customDiameter?: number;

  /** Setting this property changes LoadingIndicatorComponent to be inline. */
  @Input() inlineText?: string;

  /** The diameter property. */
  diameter = 100;

  /**
   * Sets diameter to customDiameter or to 18 if inline.
   */
  ngOnInit(): void {
    if (this.customDiameter) {
      this.diameter = this.customDiameter;
    }
    if (this.inlineText) {
      this.diameter = 18;
    }
  }
}
