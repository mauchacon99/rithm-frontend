import { Component } from '@angular/core';
/**
 *
 */
@Component({
  selector: 'app-build-drawer',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent {
  buildCategories: string[] = [
    'Form Inputs',
    'Previous Fields',
    'Components',
    'Integrations',
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}
