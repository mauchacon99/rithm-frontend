import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StationColumnWidget, WidgetDrawerStationData } from 'src/models';

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-station-widget-drawer',
  templateUrl: './station-widget-drawer.component.html',
  styleUrls: ['./station-widget-drawer.component.scss'],
})
export class StationWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Station RithmId. */
  stationRithmId!: string;

  /** Station columns. */
  stationColumns!: StationColumnWidget[];

  /** Position of the widget. */
  widgetIndex!: number;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the called widget-drawer. */
  drawerMode: 'stationWidget' = 'stationWidget';

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** Station data. */
          stationData: string;
          /** Position of the widget. */
          widgetIndex: number;
        };
        if (dataDrawer) {
          const stationData = JSON.parse(
            dataDrawer.stationData
          ) as WidgetDrawerStationData;
          this.stationRithmId = stationData.stationRithmId;
          this.stationColumns = stationData.columns;
          this.widgetIndex = dataDrawer.widgetIndex;
        }
      });
  }

  /**
   * Toggles the open state for drawer mode.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'stationWidget'): void {
    if (drawerItem === 'stationWidget') {
      this.sidenavDrawerService.toggleDrawer(drawerItem);
    }
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
