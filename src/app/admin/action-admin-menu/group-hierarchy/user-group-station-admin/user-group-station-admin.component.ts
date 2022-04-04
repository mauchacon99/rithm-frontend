import { Component, Input } from '@angular/core';
import { StationGroupData, StationListGroup } from 'src/models';
import { MapService } from 'src/app/map/map.service';
import { Router } from '@angular/router';

/** Component group station admin. */
@Component({
  selector: 'app-user-group-station-admin[selectedItem]',
  templateUrl: './user-group-station-admin.component.html',
  styleUrls: ['./user-group-station-admin.component.scss'],
})
export class UserGroupStationAdminComponent {
  /** Value of selected item. */
  @Input() selectedItem!: StationGroupData | StationListGroup;

  /**
   * Return if selectedItem is group.
   *
   * @returns Is group.
   */
  get isGroup(): boolean {
    return 'stations' in this.selectedItem;
  }

  /**
   * Return name or title depending typeof selectedItem.
   *
   * @returns Name element.
   */
  get nameElement(): string {
    return 'name' in this.selectedItem
      ? this.selectedItem.name
      : this.selectedItem.title;
  }

  constructor(private mapService: MapService, private router: Router) {}

  /**
   * Navigate the user to the station on the map.
   */
  goToStationOnMap(): void {
    const emitCenterOnMap = this.isGroup
      ? 'centerStationGroupRithmId$'
      : 'centerStationRithmId$';
    this.mapService.mapStationHelper[emitCenterOnMap].next(
      this.selectedItem.rithmId
    );
    this.mapService.mapHelper.viewStationButtonClick$.next(true);
    this.router.navigateByUrl('/map');
  }
}
