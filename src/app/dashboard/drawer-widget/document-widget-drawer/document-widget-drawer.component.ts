import {
  Component,
  EventEmitter,
  OnDestroy,
  ViewEncapsulation,
  OnInit,
  Output,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { first } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  ColumnFieldsWidget,
  DashboardItem,
  DocumentImage,
  EditDataWidget,
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
  selector: 'app-document-widget-drawer',
  templateUrl: './document-widget-drawer.component.html',
  styleUrls: ['./document-widget-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentWidgetDrawerComponent implements OnInit, OnDestroy {
  /** Image to banner. */
  @Input() set image(value: DocumentImage) {
    if (
      this.dataDrawerDocument?.widgetItem &&
      this.dataDrawerDocument?.widgetItem.imageId !== value.imageId
    ) {
      this.dataDrawerDocument.widgetItem.imageId = value.imageId;
      this.dataDrawerDocument.widgetItem.imageName = value.imageName;
      this.emitUpdateWidget();
    }
  }

  /** Emit widgetIndex to widget-drawer. */
  @Output() setWidgetIndex = new EventEmitter<number>();

  /** WidgetType of item. */
  @Output() getWidgetItem = new EventEmitter<DashboardItem>();

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Form to multiselect columns to document. */
  formColumns = new FormControl();

  /** Form to select profile image. */
  formProfileImageId = new FormControl();

  /** Questions the document. */
  questions!: QuestionList[];

  /** Document RithmId. */
  documentRithmId!: string;

  /** Data drawer document. */
  dataDrawerDocument!: EditDataWidget;

  /** Value used to compare the widgets. */
  enumWidgetType = WidgetType;

  /** Loading drawer. */
  isLoading = false;

  /** Toggle to show error message if get request fails.*/
  failedLoadDrawer = false;

  /** Columns list to display in select. */
  documentFields: ColumnFieldsWidget[] = [];

  /** Document columns. */
  documentColumns: ColumnFieldsWidget[] = [];

  /** Document profile images. */
  documentProfileImages: DocumentImage[] = [];

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private documentService: DocumentService,
    private errorService: ErrorService,
    private dashboardService: DashboardService
  ) {}

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
          this.dataDrawerDocument = dataDrawer;
          const dataWidget = JSON.parse(
            this.dataDrawerDocument.widgetItem.data
          );
          this.documentColumns = dataWidget.columns || [];
          this.documentRithmId = dataWidget.documentRithmId;
          this.setWidgetIndex.emit(this.dataDrawerDocument.widgetIndex);
          this.getWidgetItem.emit(this.dataDrawerDocument.widgetItem);
          this.formProfileImageId.setValue(
            this.dataDrawerDocument.widgetItem.profileImageId
          );
          this.getDocumentWidget();
          if (
            dataDrawer.widgetItem.widgetType ===
            WidgetType.ContainerProfileBanner
          ) {
            this.getProfileImagesDocuments();
          }
        }
      });
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
        this.documentFields.push({
          name: question.prompt,
          questionId: question.rithmId,
        });
        if (!this.documentColumns.length) {
          dataForm.push(question.rithmId);
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
    this.dataDrawerDocument.widgetItem.data = JSON.stringify({
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
    this.documentService
      .getImagesDocuments(this.documentRithmId)
      .pipe(first())
      .subscribe({
        next: (imagesDocument) => {
          this.documentProfileImages = imagesDocument;
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** Update profile image. */
  updateProfileImageWidget(): void {
    this.dataDrawerDocument.widgetItem.profileImageId =
      this.formProfileImageId.value;
    this.emitUpdateWidget();
  }

  /** Emit update widget. */
  private emitUpdateWidget(): void {
    this.dashboardService.updateDashboardWidgets({
      widgetItem: this.dataDrawerDocument.widgetItem,
      widgetIndex: this.dataDrawerDocument.widgetIndex,
      quantityElementsWidget: this.dataDrawerDocument.quantityElementsWidget,
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
