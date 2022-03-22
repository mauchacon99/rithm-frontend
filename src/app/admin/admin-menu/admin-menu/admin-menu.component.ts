import { Component, EventEmitter, Output } from '@angular/core';
import { ListAdminOptionMenuType } from 'src/models/enums';
import { ListAdminOptionsMenu } from 'src/models/index';
/**
 * Admin menu component.
 */
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent {
  /** Emit widgetIndex to widget-drawer. */
  @Output() itemMenuSelected = new EventEmitter<ListAdminOptionMenuType>();

  /* Current item selected.  */
  itemSelected!: ListAdminOptionMenuType;

  /* Types admin option menu.  */
  listAdminOptionMenuType = ListAdminOptionMenuType;

  /* Admin options menu.  */
  listAdminItemMenu: ListAdminOptionsMenu[] = [
    {
      name: 'Account Settings',
      type: this.listAdminOptionMenuType.AccountSettings,
    },
    {
      name: 'Group Hierarchy',
      type: this.listAdminOptionMenuType.GroupHierarchy,
    },
    {
      name: 'Directory',
      type: this.listAdminOptionMenuType.Directory,
    },
    {
      name: 'Integrations',
      type: this.listAdminOptionMenuType.Integrations,
    },
  ];

  /**
   * Get item selected item menu.
   *
   * @param optionSelected Option list menu selected.
   */
  getItemSelected(optionSelected: ListAdminOptionMenuType): void {
    this.itemMenuSelected.emit(optionSelected);
  }
}
