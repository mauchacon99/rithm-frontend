import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/core/popup.service';

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

  /** Emit event for delete widget in dashboard. */
  @Output() deleteWidget = new EventEmitter<number>();

  /** Widget index of opened widget-drawer. */
  widgetIndex!: number;

  /** Whether the called widget-drawer. */
  drawerMode: 'stationWidget' | 'documentWidget' = 'stationWidget';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data === 'stationWidget' || data === 'documentWidget') {
          this.drawerMode = data;
        }
      });
  }

  /**
   * Toggles the open state for drawer mode.
   *
   */
  toggleDrawer(): void {
    if (
      this.drawerMode === 'stationWidget' ||
      this.drawerMode === 'documentWidget'
    ) {
      this.sidenavDrawerService.toggleDrawer(this.drawerMode);
    }
  }

  /**
   * Show alert confirm widget delete.
   *
   */
  async confirmWidgetDelete(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Delete Widget?',
      message: 'This cannot be undone!',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    });
    if (response) {
      this.toggleDrawer();
      this.deleteWidget.emit(this.widgetIndex);
    }
  }

  /**
   * Event emit widgetIndex to dashboard.
   *
   * @param widgetIndex Widget index from station-widget-drawer.
   */
  setWidgetIndex(widgetIndex: number): void {
    this.widgetIndex = widgetIndex;
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
