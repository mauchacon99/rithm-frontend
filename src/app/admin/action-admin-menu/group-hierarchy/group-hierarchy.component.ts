import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';

/**
 * Component to show hierarchy on admin panel.
 */
@Component({
  selector: 'app-group-hierarchy[showGroupHierarchy]',
  templateUrl: './group-hierarchy.component.html',
  styleUrls: ['./group-hierarchy.component.scss'],
})
export class GroupHierarchyComponent {
  /** Value to show or hidden this component based on permission. */
  @Input() showGroupHierarchy!: boolean;

  /** Value of selected item. */
  selectedItem!: StationGroupData | StationListGroup;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.selectedItem ? true : false;
  }

  /**
   * Set value selected item.
   *
   * @param value Selected item data.
   */
  setSelectItem(value: StationGroupData | StationListGroup): void {
    this.selectedItem = value;
  }
}
