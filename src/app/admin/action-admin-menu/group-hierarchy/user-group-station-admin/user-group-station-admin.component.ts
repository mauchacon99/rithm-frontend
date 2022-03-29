import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';
/** Component group station admin. */
@Component({
  selector: 'app-user-group-station-admin[selectedItem]',
  templateUrl: './user-group-station-admin.component.html',
  styleUrls: ['./user-group-station-admin.component.scss'],
})
export class UserGroupStationAdminComponent {
  /** Value of selected item. */
  @Input() selectedItem!: StationGroupData | StationListGroup;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.selectedItem;
  }
}
