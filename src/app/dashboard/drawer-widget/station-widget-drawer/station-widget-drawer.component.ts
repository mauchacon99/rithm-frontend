import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavDrawerService } from '../../../core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { StationInfoDrawerData } from '../../../../models';
import { Subject } from 'rxjs';

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-station-widget-drawer',
  templateUrl: './station-widget-drawer.component.html',
  styleUrls: ['./station-widget-drawer.component.scss'],
})
export class StationWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Station rithmId. */
  stationRithmId!: string;

  /** Position of the widget. */
  widgetIndex!: number;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as {
          /** Station rithmId. */
          stationRithmId: string;
          /** Position of the widget. */
          widgetIndex: number;
        };
        if (dataDrawer) {
          console.log(dataDrawer);
          this.stationRithmId = dataDrawer.stationRithmId;
          this.widgetIndex = dataDrawer.widgetIndex;
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
