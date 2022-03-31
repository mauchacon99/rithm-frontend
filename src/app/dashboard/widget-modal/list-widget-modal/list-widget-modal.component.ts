import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { first } from 'rxjs/operators';
import { UserService } from '../../../core/user.service';
import { SplitService } from '../../../core/split.service';
import { ErrorService } from '../../../core/error.service';

/**
 * The component for list widget modal.
 */
@Component({
  selector: 'app-list-widget-modal[itemWidgetModalSelected]',
  templateUrl: './list-widget-modal.component.html',
  styleUrls: ['./list-widget-modal.component.scss'],
})
export class ListWidgetModalComponent implements OnInit {
  /** Item widget modal selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title preview widget selected emit. */
  @Output() previewWidgetSelected = new EventEmitter<
    WidgetType | 'defaultDocument'
  >();

  /** Show section document profile. */
  isContainerProfileBanner = false;

  /** Enum widget types. */
  enumWidgetType = WidgetType;

  constructor(
    private userService: UserService,
    private splitService: SplitService,
    private errorService: ErrorService
  ) {}

  /**
   * Initialize split on page load.
   */
  ngOnInit(): void {
    this.split();
  }

  /** Split Service. */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.isContainerProfileBanner =
          this.splitService.getProfileBannerTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Emit preview widget selected.
   *
   * @param widgetType Widget type selected.
   */
  emitPreviewWidgetSelected(widgetType: WidgetType | 'defaultDocument'): void {
    this.previewWidgetSelected.emit(widgetType);
  }
}
