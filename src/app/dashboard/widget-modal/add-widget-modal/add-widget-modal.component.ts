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
  identifyShowElement: 'document' | 'station' | 'group' | 'tabs' = 'tabs';

  /** Tab Parents selected. */
  tabParentSelect = 0;

  /** Enum widget type. */
  enumWidgetType = WidgetType;

  /** Show group widget template. */
  showGroupTemplate = false;

  constructor(
    private dialogRef: MatDialogRef<AddWidgetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public matData: string,
    private splitService: SplitService,
    private errorService: ErrorService,
    private userService: UserService
  ) {
    this.dashboardRithmId = matData;
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

  /** Return to widget list when identifyShowElement is not tabs. */
  returnCustomLists(): void {
    this.previewWidgetTypeSelected
      ? (this.previewWidgetTypeSelected = null)
      : (this.identifyShowElement = 'tabs');
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
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }
}
