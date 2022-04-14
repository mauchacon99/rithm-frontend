import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  FrameType,
  ImageWidgetObject,
  Question,
  SettingDrawerData,
} from 'src/models';

/**
 * Component for setting drawer in the station.
 */
@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.scss'],
})
export class SettingDrawerComponent implements OnInit, OnDestroy {
  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The field information for your setting. */
  fieldSetting!: Question | ImageWidgetObject | string;

  /** Field to be passed. */
  field!: Question;

  /** The field frame type for your setting. */
  fieldFrameType!: FrameType;

  /** Frame types list.  */
  frameTypes = FrameType;

  /** The station id of the current station. */
  stationRithmId!: string;

  constructor(
    private sideNavDrawerService: SidenavDrawerService,
    private route: ActivatedRoute,
    private errorService: ErrorService
  ) {}

  /**
   * Listen the DrawerData Service.
   */
  private subscribeDrawerData$(): void {
    this.sideNavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as SettingDrawerData;
        this.fieldSetting = dataDrawer.field;
        this.fieldFrameType = dataDrawer.frame;
        if (
          typeof dataDrawer.field !== 'string' &&
          'rithmId' in (dataDrawer.field as Question)
        ) {
          this.field = this.fieldSetting as Question;
        }
        this.getStationId();
      });
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.subscribeDrawerData$();
  }

  /**
   * Get from the route parameters the id of the current station.
   */
  private getStationId(): void {
    this.route.params.pipe(first()).subscribe({
      next: (params) => {
        if (params.stationId) {
          this.stationRithmId = params.stationId;
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
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
