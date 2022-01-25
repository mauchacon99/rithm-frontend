import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { RoleDashboardMenu } from 'src/models';

/**
 * Options menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-options-menu[dashboardRole]',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.scss'],
})
export class OptionsMenuComponent {
  /**
   * Dashboard type from expansion-menu.
   */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;

  /** Allows functionality of MatMenu to toggle the menu open. */
  @ViewChild(MatMenuTrigger)
  private optionsMenuTrigger!: MatMenuTrigger;

  /**
   * Opens the option menu on the dashboard menu.
   *
   * @param event The click event.
   */
  openOptionsMenu(event: MouseEvent): void {
    this.optionsMenuTrigger.openMenu();
    event.stopPropagation();
  }
}
