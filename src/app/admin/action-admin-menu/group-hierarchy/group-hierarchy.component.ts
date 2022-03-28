import { Component, Input } from '@angular/core';

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

  /**
   * Push stationGroupRithmId to colums.
   *
   * @param rithmId StationGroupRithmId selected.
   * @param index Number of the column rendered.
   */
  onSelectStationGroupRithmId(rithmId: string, index: number): void {
    this.columnsStationGroupRithmId.splice(index + 1);
    this.columnsStationGroupRithmId.push(rithmId);
  }
}
