import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { Question } from 'src/models';

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
  fieldSetting!: Question;

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
        const dataDrawer = data as Question;
        this.fieldSetting = dataDrawer;
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
   *
   * @returns Is boolean.
   */
  get fieldReadOnly(): boolean {
    this.fieldSetting.isReadOnly = !this.fieldSetting.isReadOnly;
    this.fieldSetting.isRequired = !this.fieldSetting.isReadOnly
      ? this.fieldSetting.isReadOnly
      : this.fieldSetting.isRequired;
    return this.fieldSetting.isReadOnly;
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
