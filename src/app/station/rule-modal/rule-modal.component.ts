import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Reusable component for displaying the information to add a new rule.
 */
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss'],
})
export class RuleModalComponent {
  /** Station Rithm id. */
  stationRithmId = '';

  constructor(
    public dialogRef: MatDialogRef<RuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public rithmId: string
  ) {
    this.stationRithmId = rithmId;
  }

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
