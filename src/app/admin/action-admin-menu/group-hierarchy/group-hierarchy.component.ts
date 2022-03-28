import { Component } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';

/**
 * Component to show hierarchy on admin panel.
 */
@Component({
  selector: 'app-group-hierarchy',
  templateUrl: './group-hierarchy.component.html',
  styleUrls: ['./group-hierarchy.component.scss'],
})
export class GroupHierarchyComponent {
  /** Value of selected item. */
  selectedItem!: StationGroupData | StationListGroup;

  /** Type of selected item. */
  typeSelectedItem!: 'group' | 'station';

  /**
   * Set value selected item.
   *
   * @param value Selected item data.
   */
  setSelectItem(value: StationGroupData | StationListGroup): void {
    this.selectedItem = value;
  }

  /**
   * Set type selected item.
   *
   * @param type Selected item type.
   */
  setTypeSelectedItem(type: 'group' | 'station'): void {
    this.typeSelectedItem = type;
  }
}
