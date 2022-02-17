import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Component for widget drawer.
 */
@Component({
  selector: 'app-widget-drawer',
  templateUrl: './widget-drawer.component.html',
  styleUrls: ['./widget-drawer.component.scss'],
})
export class WidgetDrawerComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the called widget-drawer. */
  drawerMode: 'stationWidget' = 'stationWidget';

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data === 'stationWidget') {
          this.drawerMode = data;
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
