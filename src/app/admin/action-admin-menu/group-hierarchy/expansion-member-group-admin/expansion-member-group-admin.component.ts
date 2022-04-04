import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';

/** Component expansions member. */
@Component({
  selector: 'app-expansion-member-group-admin[selectedItem][isAdmin]',
  templateUrl: './expansion-member-group-admin.component.html',
  styleUrls: ['./expansion-member-group-admin.component.scss'],
})
export class ExpansionMemberGroupAdminComponent {
  /** Value of selected item. */
  @Input() selectedItem!: StationGroupData | StationListGroup;

  /** Is admin. */
  @Input() isAdmin!: boolean;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.selectedItem;
  }
}
