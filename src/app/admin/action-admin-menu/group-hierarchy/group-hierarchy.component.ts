import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';

interface itemSelected {
  /** Selected item type. */
  type: string;

  /** Selected item RithmId. */
  rithmId: string;

  /** Selected item name. */
  name: string;

  /** Selected item data. */
  data: string;
}
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

  /** List element selected. */
  itemListSelected: itemSelected[] = [
    {
      type: 'group',
      rithmId: '',
      name: 'Home',
      data: '{}',
    },
  ];

  /** List group selected. */
  groupItemListSelected: itemSelected[] = [
    {
      type: 'group',
      rithmId: '',
      name: 'Home',
      data: '{}',
    },
  ];

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
    this.itemListSelected.splice(index + 1);
    this.groupItemListSelected.splice(index + 1);

    this.itemListSelected.push({
      type: this.isGroup ? 'group' : 'station',
      rithmId: itemSelected.rithmId,
      name: this.isGroup
        ? (itemSelected as StationGroupData).title
        : (itemSelected as StationListGroup).name,
      data: JSON.stringify(itemSelected),
    });

    if (this.isGroup) {
      this.groupItemListSelected.push({
        type: 'group',
        rithmId: itemSelected.rithmId,
        name: (itemSelected as StationGroupData).title,
        data: JSON.stringify(itemSelected),
      });
    }
  }

  /**
   * Navigation in options list columns.
   *
   * @param index Index selected.
   */
  moveList(index: number): void {
    this.groupItemListSelected.splice(index + 1, this.itemListSelected.length);
    this.itemListSelected.forEach((item) => {
      if (
        item.rithmId ===
        this.groupItemListSelected[this.groupItemListSelected.length - 1]
          .rithmId
      )
        this.selectedItem = JSON.parse(item.data);
    });
  }
}
