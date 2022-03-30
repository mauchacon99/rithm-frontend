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

  /** Columns of render with stationGroupRithmId. */
  columnsStationGroupRithmId: string[] = [''];

  /** Value of selected item. */
  selectedItem!: StationGroupData | StationListGroup;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.selectedItem;
  }

  /**
   * Set value of item selected and generate columns.
   *
   * @param itemSelected Selected item StationGroupData | StationListGroup.
   * @param index Number of the column rendered.
   */
  setSelectItem(
    itemSelected: StationGroupData | StationListGroup,
    index: number
  ): void {
    this.selectedItem = itemSelected;
    this.columnsStationGroupRithmId.splice(index + 1);
    if (this.isGroup) {
      this.columnsStationGroupRithmId.push(itemSelected.rithmId);
    }
  }
}
