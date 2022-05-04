import { Component } from '@angular/core';
/**
 * Reusable component to display a modal with the list of user.
 */
@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss'],
})
export class UserListModalComponent {
  /** Location Text of the modal for the title. */
  public UserListModalValue = 'Assign Container';
}
