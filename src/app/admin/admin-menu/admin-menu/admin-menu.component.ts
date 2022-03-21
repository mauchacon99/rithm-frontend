import { Component, EventEmitter, Output } from '@angular/core';
import {
  ListAdminOptionMenuType,
  ListAdminOptionsMenu,
} from 'src/models/list-admin-option-menu';
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
  @Output() itemMenuSelected = new EventEmitter<string>();

  /*Current item selected.  */
  itemSelected = '';

  /*Types admin option menu.  */
  listAdminOptionMenuType = ListAdminOptionMenuType;

  /*Admin options menu.  */
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
  getItemSelected(optionSelected: string): void {
    this.itemMenuSelected.emit(optionSelected);
  }
}
