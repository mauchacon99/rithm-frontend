import { Component } from '@angular/core';
/**
 * Reusable component to display a modal with the list of locations.
 */
@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent {
  /** Location Text of the modal for the title.. */
  public LocationModalTextValue = 'Location Modal';
}
