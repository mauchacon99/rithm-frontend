import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
/**
 *
 */
@Component({
  selector: 'app-build-drawer',
  templateUrl: './build-drawer.component.html',
  styleUrls: ['./build-drawer.component.scss'],
})
export class BuildDrawerComponent implements OnInit {
  buildCategories: string[] = [
    'Form Inputs',
    'Previous Fields',
    'Components',
    'Integrations',
  ];

  formInputsCategory: string[] = [
    'Input Frame',
    'Short Text',
    'Long Text',
    'Email',
    'URL',
    'Address',
    'Date',
    'Single Select',
    'Multiselect',
    'Checklist',
    'Checkbox',
    'Number',
    'Phone Number',
    'Currency',
    'Child Document',
    'Custom Field',
  ];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private changeDetector: ChangeDetectorRef) {}

  /**
   * Init Component to detect changes.
   */
  ngOnInit(): void {
    this.changeDetector.detectChanges();
  }
}
