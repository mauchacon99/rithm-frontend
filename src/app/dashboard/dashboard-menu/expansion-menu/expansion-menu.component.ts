import { Component, Input, OnInit } from '@angular/core';
import { RoleDashboardMenu } from 'src/models/enums/role-dashboard-menu.enum';
/**
 * Interface show data in expansion-panel.
 */
interface InterfaceExpansionPanel {
  /** Organization type identifier. */
  Role: RoleDashboardMenu;

  /** Title expansion-title. */
  title: string;

  /** Status expanded, this save the state the panel for show icon expanded. */
  panelOpenState: boolean;
}

/**
 * Expansion menu for dashboard menu drawer.
 */
@Component({
  selector: 'app-expansion-menu',
  templateUrl: './expansion-menu.component.html',
  styleUrls: ['./expansion-menu.component.scss'],
})
export class ExpansionMenuComponent implements OnInit {
  /** Organization name. */
  @Input() organizationName!: string;

  /** Data for show in expansion-panel. */
  dataExpansionPanel: InterfaceExpansionPanel[] = [];

  /** Static data for options. */
  staticDataOptions: string[] = ['General', 'General#2'];

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.dataExpansionPanel = [
      {
        Role: RoleDashboardMenu.DashboardAdmin,
        title: `${this.organizationName} Dashboards`,
        panelOpenState: false,
      },
      {
        Role: RoleDashboardMenu.DashboardPersonal,
        title: 'Personal Dashboards',
        panelOpenState: false,
      },
    ];
  }
}
