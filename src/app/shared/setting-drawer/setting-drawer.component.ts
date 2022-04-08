import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationService } from 'src/app/core/station.service';
import { Question } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';

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
    private errorService: ErrorService,
    private popupService: PopupService,
    private stationService: StationService
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
   * Whether the current field belongs to a previous field or not.
   *
   * @returns Is boolean.
   */
  get isPrevious(): boolean {
    return this.fieldSetting.originalStationRithmId !== this.stationRithmId;
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
   * Shut off isRequired when isReadOnly is off and isPrevious = true.
   */
  public setReadOnlyFalse(): void {
    if (this.isPrevious) {
      this.fieldSetting.isRequired =
        this.fieldSetting.isReadOnly && this.fieldSetting.isRequired;
    }
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Completes all subscriptions.
   *
   * @param questions The current questions to be deleted in field settings.
   */
  async deleteQuestion(questions: Question): Promise<void> {
    const response = await this.popupService.confirm({
      title: '',
      message: 'Are you sure you want to delete this field?',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      this.stationService.deleteStationQuestion$.next(questions);
    }
  }
}
