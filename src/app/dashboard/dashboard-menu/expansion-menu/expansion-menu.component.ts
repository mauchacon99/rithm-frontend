import { Component, Input } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu[dashboardRole]',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent {
  /** Static data for options. */
  staticDataOptions: string[] = ['General', 'General#2'];

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState = false;

  /** Type dashboard. */
  @Input() dashboardRole!: RoleDashboardMenu;

  /** Validate type of role. */
  roleDashboardMenu = RoleDashboardMenu;
}
