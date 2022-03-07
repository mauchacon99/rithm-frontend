import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/core/popup.service';
import { DashboardItem, WidgetType } from 'src/models';

/**
 * Component for widget drawer.
 */
@Component({
  selector: 'app-widget-drawer',
  templateUrl: './widget-drawer.component.html',
  styleUrls: ['./widget-drawer.component.scss'],
})
export class WidgetDrawerComponent implements OnInit, OnDestroy {
  /** Reference to clear input when delete selection. */
  @ViewChild('fileInput', { static: false })
  fileInputFile!: ElementRef;

  /** Emit event for delete widget in dashboard. */
  @Output() deleteWidget = new EventEmitter<number>();

  /** Image selected in input file. */
  imageSelected: File | null = null;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Validate if the widget is type station-table-banner-widget. */
  widgetTypeEnum = WidgetType;

  /** Widget type of opened widget-drawer.*/
  widgetType!: WidgetType;

  /** Widget index of opened widget-drawer. */
  widgetIndex!: number;

  /** Whether the called widget-drawer. */
  drawerMode: 'stationWidget' | 'documentWidget' = 'stationWidget';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService,
    private changeDetector: ChangeDetectorRef
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.subscribeDrawerContext$();
    this.changeDetector.detectChanges();
  }

  /** Get drawer context the drawers. */
  private subscribeDrawerContext$(): void {
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
   * Show alert image delete in widget.
   */
  async confirmImageDelete(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Remove Image?',
      message: 'This cannot be undone.',
      important: true,
      okButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (response) {
      this.removeSelectedFile();
    }
  }

  /**
   * Select image.
   *
   * @param event Event of select image.
   */
  onSelectFile(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    if (file) {
      this.imageSelected = file;
    }
  }

  /** Remove selected file. */
  removeSelectedFile(): void {
    this.imageSelected = null;
    this.fileInputFile.nativeElement.value = '';
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
   * Get widget Item to assign widget type and reassign image in widget-drawer.
   *
   * @param widgetItem DashboardItem of widget.
   */
  setWidgetItem(widgetItem: DashboardItem): void {
    this.widgetType = widgetItem.widgetType;
    this.imageSelected = widgetItem.image ? (widgetItem.image as File) : null;
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
