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
import { first, takeUntil } from 'rxjs/operators';
import { PopupService } from 'src/app/core/popup.service';
import { DocumentImage, EditDataWidget, WidgetType } from 'src/models';
import { SplitService } from 'src/app/core/split.service';
import { ErrorService } from 'src/app/core/error.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { FormatImageValidate } from 'src/helpers';

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

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Image selected in input file. */
  imageUploaded!: DocumentImage;

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Widget type of opened widget-drawer.*/
  widgetType!: WidgetType;

  /** Data drawer. */
  dataDrawer!: EditDataWidget;

  /** Show section image banner. */
  showProfileImageBanner = false;

  /** While the image its uploading. */
  isUploading = false;

  /** Widget index of opened widget-drawer. */
  widgetIndex!: number;

  /** Show only button delete widget. */
  showOnlyButtonDelete: boolean | undefined = false;

  /** Whether the called widget-drawer. */
  drawerMode: 'widgetDashboard' = 'widgetDashboard';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private popupService: PopupService,
    private changeDetector: ChangeDetectorRef,
    private splitService: SplitService,
    private errorService: ErrorService,
    private userService: UserService,
    private documentService: DocumentService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.split();
    this.subscribeDrawerContext$();
    this.subscribeDrawerData$();
    this.changeDetector.detectChanges();
  }

  /** Get data the sidenavDrawerService. */
  private subscribeDrawerData$(): void {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as EditDataWidget;
        if (dataDrawer) {
          this.dataDrawer = dataDrawer;
          this.widgetIndex = dataDrawer.widgetIndex;
          this.widgetType = dataDrawer.widgetItem.widgetType;
          this.showOnlyButtonDelete = dataDrawer.deleteWidget;
          this.imageUploaded = {
            imageId: dataDrawer.widgetItem.imageId || null,
            imageName: dataDrawer.widgetItem.imageName || null,
          };
        }
      });
  }

  /**
   * Split Service for show or hidden section Image banner.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showProfileImageBanner =
          this.splitService.getStationUploadBannerTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /** Get drawer context the drawers. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data === 'widgetDashboard') {
          this.drawerMode = data;
        }
      });
  }

  /**
   * Toggles the open state for drawer mode.
   *
   */
  toggleDrawer(): void {
    if (this.drawerMode === 'widgetDashboard') {
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
  uploadImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    if (file) {
      const extension = file.type.split('/')[1];
      if (FormatImageValidate.isValidFormatImage(extension)) {
        // Loading banner image while upload image.
        this.sidenavDrawerService.setDisableCloseDrawerOutside(true);
        this.imageUploaded = {
          imageId: 'TEMPLoading',
          imageName: null,
        };
        this.isUploading = true;
        this.documentService
          .uploadImage(file)
          .pipe(first())
          .subscribe({
            next: (imageId) => {
              this.isUploading = false;
              this.imageUploaded = {
                imageId,
                imageName: file.name,
              };
              this.sidenavDrawerService.setDisableCloseDrawerOutside();
            },
            error: (error: unknown) => {
              this.isUploading = false;
              // Loading banner image while upload image.
              this.imageUploaded = {
                imageId: null,
                imageName: null,
              };
              this.sidenavDrawerService.setDisableCloseDrawerOutside();
              this.errorService.displayError(
                "Something went wrong on our end and we're looking into it. Please try again in a little while.",
                error
              );
            },
          });
      } else {
        this.popupService.alert({
          title: 'Image format is not valid.',
          message: 'Please select a file with extension jpeg, jpg, png.',
          important: true,
        });
      }
    }
  }

  /** Remove selected file. */
  removeSelectedFile(): void {
    this.fileInputFile.nativeElement.value = '';
    this.imageUploaded = {
      imageId: null,
      imageName: null,
    };
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
