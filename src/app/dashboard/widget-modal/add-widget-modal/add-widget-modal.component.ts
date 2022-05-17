import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent implements OnInit {
  /** Selected item to show list widget. */
  itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Title of preview widget selected. */
  previewWidgetTypeSelected: WidgetType | 'defaultDocument' | null = null;

  /** Dashboard rithm id. */
  dashboardRithmId = '';

  /** The element type to be shown. */
  identifyShowElement: 'document' | 'station' | 'group' | 'preBuilt' | 'tabs' =
    'tabs';

  /** Tab Parents selected. */
  tabParentSelect = 0;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Show group widget template. */
  showGroupTemplate = false;

  /** Show section document profile. */
  showContainerProfileBanner = false;

  /** Show group traffic template. */
  showGroupTrafficTemplate = false;

  /** Show section Stations lists. */
  showStationLists = false;

  /** Show section Pre built. */
  showPreBuilt = false;

  /** Show detail widget popover. */
  showDetailWidgetPopover = false;

  /** If can assign user. */
  canAssignUserWidget = false;

  /** Data to force pre built template. */
  itemWidgetModalSelectedData: SelectedItemWidgetModel = {
    itemType: 'preBuilt',
    itemList: {
      isChained: false,
      name: '',
      rithmId: '',
      groupName: '',
      stationGroupName: '',
      stationName: '',
      totalDocuments: 0,
      totalStations: 0,
      totalSubGroups: 0,
    },
  };

  constructor(
    private dialogRef: MatDialogRef<AddWidgetModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public matData: {
      /**Dashboard Rithm id */
      dashboardRithmId: string;
      /** Show detail widget popover. */
      showDetailWidgetPopover: boolean;
      /** If can assign user. */
      canAssignUserWidget: boolean;
    },
    private splitService: SplitService,
    private errorService: ErrorService,
    private userService: UserService
  ) {
    this.showDetailWidgetPopover = matData.showDetailWidgetPopover;
    this.dashboardRithmId = matData.dashboardRithmId;
    this.canAssignUserWidget = matData.canAssignUserWidget;
  }

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.split();
  }

  /** Close add widgets modal. */
  closeModal(): void {
    this.dialogRef.close();
  }

  /**
   * Getting the type for the selected element.
   *
   * @param element The type of element.
   */
  selectTypeElement(element: SelectedItemWidgetModel): void {
    this.itemWidgetModalSelected = element;
    this.identifyShowElement = element.itemType;
  }

  /**
   * Widget selected preBuilt in list-widget.
   *
   * @param item The type of element.
   */
  selectTypeElementPreBuilt(item: WidgetType | 'defaultDocument'): void {
    this.itemWidgetModalSelected = { itemType: 'preBuilt' };
    this.identifyShowElement = 'preBuilt';
    this.previewWidgetTypeSelected = item;
  }

  /** Return to widget list when identifyShowElement is not tabs. */
  returnCustomLists(): void {
    if (this.itemWidgetModalSelected.itemType === 'preBuilt') {
      this.previewWidgetTypeSelected = null;
      this.identifyShowElement = 'tabs';
    } else {
      this.previewWidgetTypeSelected
        ? (this.previewWidgetTypeSelected = null)
        : (this.identifyShowElement = 'tabs');
    }
  }

  /**
   * Split Service for show or hidden section Admin Portal.
   */
  private split(): void {
    this.splitService.initSdk(this.userService.user.organization);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.showGroupTemplate =
          this.splitService.getGroupSectionAddWidgetTreatment() === 'on';

        this.showContainerProfileBanner =
          this.splitService.getProfileBannerTreatment() === 'on';

        this.showGroupTrafficTemplate =
          this.splitService.getGroupTrafficTemplateTreatment() === 'on';

        this.showStationLists =
          this.splitService.getStationListWidgetTreatment() === 'on';

        this.showPreBuilt =
          this.splitService.getPreBuiltWidgetTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }
}
