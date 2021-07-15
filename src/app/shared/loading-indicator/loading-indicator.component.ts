import { Component, Input, OnInit } from '@angular/core';
/**
 * Loading indicator component.
 */
@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent implements OnInit{
  /** A custom diameter property. */
  @Input() customDiameter?: number;

  /** The diameter property. */
  diameter = 100;

  /**
   * Sets diameter to customDiameter.
   */
  ngOnInit(): void {
    if (this.customDiameter) {
      this.diameter = this.customDiameter;
    }
  }
}
