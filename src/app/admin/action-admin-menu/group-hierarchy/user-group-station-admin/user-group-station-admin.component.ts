import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';
/** Component group station admin. */
@Component({
  selector: 'app-user-group-station-admin[selectedItem][typeSelectedItem]',
  templateUrl: './user-group-station-admin.component.html',
  styleUrls: ['./user-group-station-admin.component.scss'],
})
export class UserGroupStationAdminComponent {
  /** Value of selected item. */
  @Input() selectedItem!: StationGroupData | StationListGroup;

  /** Type of selected item. */
  @Input() typeSelectedItem!: 'group' | 'station';
}
