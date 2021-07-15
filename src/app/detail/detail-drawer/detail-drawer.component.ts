import { Component, Input } from '@angular/core';

/**
 * Component for all content inside the drawer for detail (station/document) pages.
 */
@Component({
  selector: 'app-detail-drawer[itemType]',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent {

  /**
   * The type of detail item to display in the drawer.
   */
  @Input()
  itemType!: 'comments' | 'history';

}
