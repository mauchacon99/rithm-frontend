import { Component, Input } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentStationInformation } from 'src/models';

/**
 * Component for the sub header on document/station views that houses the
 * comments and history.
 */
@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent {
  /** DetailItem. */
  @Input() detailItem!: string;

  /** Parent document information. */
  @Input() documentInformation?: DocumentStationInformation;

  /** Parent title information. */
  @Input() title?: string;

  /** Current active icon. */
  activeItem = 'none';

  constructor(
    private sidenavDrawerService: SidenavDrawerService
  ) { }

  /**
   * Toggles the open state detail drawer for comments or history.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'comments' | 'history'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem, this.documentInformation);
    if ((drawerItem === 'history' && this.activeItem === 'none') || (drawerItem === 'comments' && this.activeItem === 'none')) {
      this.activeItem = drawerItem;
    } else {
      this.activeItem = 'none';
    }
  }
}
