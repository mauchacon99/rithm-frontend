import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
/**
 * Reusable component to display a modal with the list of user.
 */
@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss'],
})
export class UserListModalComponent {
  constructor(public dialogRef: MatDialogRef<UserListModalComponent>) {}

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
