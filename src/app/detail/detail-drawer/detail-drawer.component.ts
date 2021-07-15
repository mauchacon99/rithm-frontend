import { Component } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Component for all content inside the drawer for detail (station/document) pages.
 */
@Component({
  selector: 'app-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent {

  /**
   * The type of detail item to display in the drawer.
   */
  itemType: string;

  constructor(
    private sidenavDrawerService: SidenavDrawerService
  ) {
    this.itemType = this.sidenavDrawerService.drawerContext;
  }

}
