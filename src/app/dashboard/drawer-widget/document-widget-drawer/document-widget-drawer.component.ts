import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DashboardItem, EditDataWidget } from 'src/models';
/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-document-widget-drawer',
  templateUrl: './document-widget-drawer.component.html',
  styleUrls: ['./document-widget-drawer.component.scss'],
})
export class DocumentWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Emit widgetIndex to widget-drawer. */
  @Output() setWidgetIndex = new EventEmitter<number>();

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Widget item of opened widget-drawer. */
  widgetItem!: DashboardItem;

  /** Widget index of opened widget-drawer. */
  widgetIndex!: number;

  /** Element list in drawer. */
  quantityElementsWidget = 0;

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.subscribeDrawerData$();
  }

  /** Get data the sidenavDrawerService. */
  private subscribeDrawerData$(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as EditDataWidget;
        if (dataDrawer) {
          this.widgetItem = dataDrawer.widgetItem;
          this.widgetIndex = dataDrawer.widgetIndex;
          this.quantityElementsWidget = dataDrawer.quantityElementsWidget;
          this.setWidgetIndex.emit(this.widgetIndex);
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
