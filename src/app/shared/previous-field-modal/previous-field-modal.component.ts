import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for previous field.
 */
@Component({
  selector: 'app-previous-field-modal',
  templateUrl: './previous-field-modal.component.html',
  styleUrls: ['./previous-field-modal.component.scss']
})
 export class PreviousFieldModalComponent {

  /** Whether the previous field is private. */
  isPrivate: boolean;

  /** The previous field rithmId. */
  previousFieldRithmId = '';

  constructor(@Inject(MAT_DIALOG_DATA) public modalData: {
    /** The rithmId for the previous field. */
    rithmId: string;
    /** Whether the previous field is private. */
    isPrivate: boolean;
  }) {
    this.previousFieldRithmId = modalData.rithmId;
    this.isPrivate = modalData.isPrivate;
  }
}


