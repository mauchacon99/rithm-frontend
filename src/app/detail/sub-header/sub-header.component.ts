import { Component, Input } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

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

  constructor(
    private sidenavDrawerService: SidenavDrawerService
  ) {}

  /**
   * Toggles the open state detail drawer for comments or history.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'comments' | 'history'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem);
  }
}
