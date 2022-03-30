import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
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

  constructor(private sideNavDrawerService: SidenavDrawerService) {}

  /**
   * Listen the DrawerData Service.
   */
  private subscribeDrawerData$(): void {
    this.sideNavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as Question;
        this.fieldSetting = dataDrawer;
      });
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.subscribeDrawerData$();
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
