import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import {
  ColumnFieldsWidget,
  DocumentImage,
  EditDataWidget,
  QuestionFieldType,
  QuestionList,
  WidgetType,
} from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

/**
 * Component for Station widget drawer.
 */
@Component({
  selector: 'app-document-widget-drawer[showProfileImageBanner][dataDrawer]',
  templateUrl: './document-widget-drawer.component.html',
  styleUrls: ['./document-widget-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentWidgetDrawerComponent implements OnInit {
  /** Data Drawer document. */
  @Input() dataDrawer!: EditDataWidget;

  /** Image to banner. */
  @Input() set image(value: DocumentImage) {
    if (
      this.dataDrawer?.widgetItem &&
      this.dataDrawer?.widgetItem.imageId !== value.imageId
    ) {
      this.dataDrawer.widgetItem.imageId = value.imageId;
      this.dataDrawer.widgetItem.imageName = value.imageName;
      this.emitUpdateWidget();
    }
  }

  /** Show section image document drawer. */
  private _showProfileImageBanner = false;

  /** Set profile image banner permission. */
  @Input() set showProfileImageBanner(value: boolean) {
    this._showProfileImageBanner = value;
    if (
      this.dataDrawer?.widgetItem?.widgetType ===
        WidgetType.ContainerProfileBanner &&
      this._showProfileImageBanner
    ) {
      this.getProfileImagesDocuments();
    }
  }

  /**
   * Get show profile image permission.
   *
   * @returns Profile image permission.
   */
  get showProfileImageBanner(): boolean {
    return this._showProfileImageBanner;
  }

  /** Form to multiselect columns to document. */
  formColumns = new FormControl();

  /** Form to select profile image. */
  formProfileImageId = new FormControl();

  /** Questions the document. */
  questions!: QuestionList[];

  /** Document RithmId. */
  documentRithmId!: string;

  /** Value used to compare the widgets. */
  enumWidgetType = WidgetType;

  /** Loading drawer. */
  isLoading = false;

  /** Loading profile image drawer. */
  isLoadingProfileImage = false;

  /** Toggle to show error message if get request fails.*/
  failedLoadDrawer = false;

  /** Toggle to show error message if get request fails.*/
  failedLoadProfileImageData = false;

  /** Columns list to display in select. */
  documentFields: ColumnFieldsWidget[] = [];

  /** Document columns. */
  documentColumns: ColumnFieldsWidget[] = [];

  /** Document profile images. */
  documentProfileImages: DocumentImage[] = [];

  /** Enum questions type. */
  enumQuestionFieldType = QuestionFieldType;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    const dataWidget = JSON.parse(this.dataDrawer.widgetItem.data);
    this.documentColumns = dataWidget.columns || [];
    this.documentRithmId = dataWidget.documentRithmId;
    this.formProfileImageId.setValue(this.dataDrawer.widgetItem.profileImageId);
    this.getDocumentWidget();
  }

  /** Get document widget. */
  private getDocumentWidget(): void {
    this.isLoading = true;
    this.failedLoadDrawer = false;
    this.documentService
      .getDocumentWidget(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (documentWidget) => {
          this.isLoading = false;
          this.failedLoadDrawer = false;
          this.questions = documentWidget.questions;
          this.loadColumnsSelect();
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.failedLoadDrawer = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Load list of selects. */
  private loadColumnsSelect(): void {
    this.formColumns.reset();
    this.documentFields = [];
    const dataForm: string[] = [];
    this.questions?.map((questionList) => {
      questionList.questions?.map((question) => {
        if (
          question.questionType !== this.enumQuestionFieldType.File &&
          question.questionType !== this.enumQuestionFieldType.DataLink
        ) {
          this.documentFields.push({
            name: question.prompt,
            questionId: question.rithmId,
          });
          if (!this.documentColumns.length) {
            dataForm.push(question.rithmId);
          }
        }
      });
    });
    if (this.documentColumns.length) {
      this.documentColumns?.map((column) => {
        dataForm.push(column.questionId as string);
      });
    }
    this.formColumns.setValue(dataForm);
  }

  /** Update columns list widget. */
  updateColumnsListWidget(): void {
    this.documentColumns = [];
    this.formColumns.value?.map((questionId: string) => {
      this.documentColumns.push({
        name: 'Question Document',
        questionId,
      });
    });
    this.dataDrawer.widgetItem.data = JSON.stringify({
      documentRithmId: this.documentRithmId,
      columns: this.documentColumns,
    });
    this.loadColumnsSelect();
    this.emitUpdateWidget();
  }

  /**
   * Get profile images document.
   *
   */
  getProfileImagesDocuments(): void {
    this.isLoadingProfileImage = true;
    this.failedLoadProfileImageData = false;
    this.documentService
      .getImagesDocuments(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (imagesDocument) => {
          this.documentProfileImages = imagesDocument;
          this.isLoadingProfileImage = false;
          this.failedLoadProfileImageData = false;
        },
        error: (error: unknown) => {
          this.isLoadingProfileImage = false;
          this.failedLoadProfileImageData = true;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Update profile image. */
  updateProfileImageWidget(): void {
    this.dataDrawer.widgetItem.profileImageId = this.formProfileImageId.value;
    this.emitUpdateWidget();
  }

  /** Emit update widget. */
  private emitUpdateWidget(): void {
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.dataDrawer.widgetItem,
      widgetIndex: this.dataDrawer.widgetIndex,
      quantityElementsWidget: this.dataDrawer.quantityElementsWidget,
    });
  }
}
