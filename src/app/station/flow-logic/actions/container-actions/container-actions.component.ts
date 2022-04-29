import { Component } from '@angular/core';
import { Question, Station } from 'src/models';

/** Container action tab. */
@Component({
  selector: 'app-container-actions',
  templateUrl: './container-actions.component.html',
  styleUrls: ['./container-actions.component.scss'],
})
export class ContainerActionsComponent {
  /** Whether the user is adding a new container action. */
  addingAction = false;

  /** Autocomplete stations. */
  stations: Station[] = [];

  /** Autocomplete stations. */
  currentStationFields: Question[] = [];
}
