import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterContentChecked,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  StationInformation,
  QuestionFieldType,
  ConnectedStationInfo,
  DocumentNameField,
  Question,
  PossibleAnswer,
  FlowLogicRule,
  StationFrameWidget,
  FrameType,
  ImageWidgetObject,
  DataLinkObject,
  SettingDrawerData,
} from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, Observable, Subject } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  GridsterConfig,
  GridsterItem,
  GridsterItemComponent,
  GridsterItemComponentInterface,
  GridsterPush,
} from 'angular-gridster2';
import { StationService } from 'src/app/core/station.service';
import { PopupService } from 'src/app/core/popup.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { FlowLogicComponent } from 'src/app/station/flow-logic/flow-logic.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';

/**
 * Main component for viewing a station.
 */
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  /** The component for the drawer that houses comments and history. */
  @ViewChild('rightDrawer', { static: true })
  drawer!: MatDrawer;

  /** Indicate error when saving flow rule. */
  @ViewChild(FlowLogicComponent, { static: false })
  childFlowLogic!: FlowLogicComponent;

  /** Indicate item of Gridster to modify. */
  @ViewChild(GridsterItemComponent, { static: false })
  gridItem!: GridsterItemComponent;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Get station name from behaviour subject. */
  private stationName = '';

  /** Station Rithm id. */
  stationRithmId = '';

  /** Station form. */
  stationForm: FormGroup;

  /** The information about the station. */
  stationInformation!: StationInformation;

  /** Different types of input frames components.*/
  frameType = FrameType;

  /** Index for station tabs. */
  stationTabsIndex = 0;

  /** The current focused/selected widget. */
  widgetFocused = -1;

  /** Indicates when the button to move the widget will be enabled. */
  widgetMoveButton = -1;

  /** The list of all the input frames in the grid. */
  inputFrameList: string[] = [];

  /** The list of stations that follow this station. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that precede this station. */
  previousStations: ConnectedStationInfo[] = [];

  /** Appended Fields array. */
  appendedFields: DocumentNameField[] = [];

  /** Contains the rules received from Flow Logic to save them. */
  pendingFlowLogicRules: FlowLogicRule[] = [];

  /** Station Widgets array. */
  inputFrameWidgetItems: StationFrameWidget[] = [];

  /** Old interface station data link widgets. */
  dataLinkArray: DataLinkObject[] = [];

  /** Current stations questions. */
  currentStationQuestions: Question[] = [];

  /** Flag that renames the save button when the selected tab is Flow Logic. */
  isFlowLogicTab = false;

  /** Show Hidden accordion field private. */
  accordionFieldPrivateExpanded = false;

  /** Show Hidden accordion all field. */
  accordionFieldAllExpanded = false;

  /** View new station. */
  viewNewStation = false;

  /** Edit mode toggle for station. */
  editMode = false;

  /** Flag that show if is layout mode. */
  layoutMode = true;

  /** Flag that show if is setting mode. */
  settingMode = false;

  /** Flag showing if the right drawer is open. */
  isOpenDrawerLeft = false;

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  /** The selected tab index/init. */
  headerTabIndex = 0;

  /** Grid initial values. */
  options: GridsterConfig = {
    gridType: 'verticalFixed',
    fixedRowHeight: 50,
    displayGrid: 'always',
    pushItems: true,
    pushResizeItems: true,
    draggable: {
      enabled: true,
      ignoreContent: true,
    },
    resizable: {
      enabled: true,
    },
    itemResizeCallback: StationComponent.itemResize,
    margin: 12,
    minCols: 24,
    maxCols: 24,
  };

  /** Loading / Error variables. */

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** Whether the request to get the widgets is currently underway. */
  widgetLoading = false;

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** Circles in the gridster. */
  circlesWidget!: string;

  /** Flag to indicate whether the focus is on a text component or not. */
  showTextAlignIcons = false;

  /** List of all text widget types. */
  readonly textWidgetTypes = [
    FrameType.Body,
    FrameType.Title,
    FrameType.Headline,
  ];

  constructor(
    private stationService: StationService,
    private documentService: DocumentService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private popupService: PopupService,
    private splitService: SplitService,
    private userService: UserService,
    @Inject(ChangeDetectorRef) private ref: ChangeDetectorRef
  ) {
    this.stationForm = this.fb.group({
      stationTemplateForm: this.fb.control(''),
      generalInstructions: this.fb.control(''),
    });
  }

  /**
   * Listen the DrawerContext Service.
   */
  private subscribeDrawerContext(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.drawerContext = context;
      });
  }

  /**
   * Listen the DocumentStationNameFields subject.
   */
  private subscribeDocumentStationNameFields(): void {
    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appFields) => {
        this.appendedFields = appFields;
      });
  }

  /**
   * Listen the stationName subject.
   */
  private subscribeStationName(): void {
    this.stationService.stationName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((stationName) => {
        this.stationName = stationName;
        if (this.stationInformation) {
          this.stationInformation.name = stationName;
        }
      });
  }

  /**
   * Listen the StationFormTouched subject.
   */
  private subscribeStationFormTouched(): void {
    this.stationService.stationFormTouched$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.stationForm.get('stationTemplateForm')?.markAsTouched();
      });
  }

  /**
   * Listen the stationQuestion subject.
   */
  private subscribeStationQuestion(): void {
    this.stationService.stationQuestion$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((question) => {
        const prevQuestion = this.stationInformation.questions.find(
          (field) => field.rithmId === question.rithmId
        );
        if (prevQuestion) {
          const questionIndex =
            this.stationInformation.questions.indexOf(prevQuestion);
          if (!question.isPossibleAnswer) {
            this.stationInformation.questions[questionIndex].prompt =
              question.prompt;
          } else {
            if (prevQuestion.possibleAnswers) {
              this.populatePossibleAnswers(
                question,
                questionIndex,
                prevQuestion.possibleAnswers
              );
            }
          }
        }
      });
  }

  /**
   * Listen for added DataLinks object.
   */
  private subscribeStationDataLink(): void {
    this.stationService.dataLinkObject$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dataLinkRetrieved) => {
        let dataLink = this.dataLinkArray.find(
          (dl) => dl.rithmId === dataLinkRetrieved.rithmId
        );
        if (dataLink) {
          dataLink = dataLinkRetrieved;
        } else {
          this.dataLinkArray.push(dataLinkRetrieved);
        }
      });
  }

  /**
   * Populate and update possibleAnswers for an specific question.
   *
   * @param answer The question we are adding possible answers to.
   * @param questionIndex The index of the current question in the station.
   * @param arrayAnswers The array of possible answers in the current question.
   */
  private populatePossibleAnswers(
    answer: Question,
    questionIndex: number,
    arrayAnswers: PossibleAnswer[] = []
  ): void {
    if (
      Array.isArray(
        this.stationInformation.questions[questionIndex].possibleAnswers
      )
    ) {
      const possibleAnswer = arrayAnswers.find(
        (a) => a.rithmId === answer.originalStationRithmId
      );
      if (possibleAnswer) {
        possibleAnswer.text = answer.prompt;
        this.stationInformation.questions[questionIndex].possibleAnswers =
          arrayAnswers;
      } else {
        const newAnswer: PossibleAnswer = {
          rithmId: answer.originalStationRithmId || '',
          text: answer.prompt,
          default: false,
        };
        this.stationInformation.questions[questionIndex].possibleAnswers?.push(
          newAnswer
        );
      }
    }
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.getTreatment();
    this.sidenavDrawerService.setDrawer(this.drawer);
    this.getParams();
    this.getPreviousAndNextStations();
    this.subscribeDrawerContext();
    this.subscribeDocumentStationNameFields();
    this.subscribeStationName();
    this.subscribeStationFormTouched();
    this.subscribeStationQuestion();
    this.subscribeStationDataLink();
    if (!this.editMode) this.setGridMode('preview');
  }

  /**
   * Gridster resize item event.
   *
   * @param item Current resized item.
   * @param itemComponent Item Interface.
   */
  static itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    if (item.type === FrameType.CircleImage) {
      const itemTo: GridsterItem = itemComponent.$item;
      if (itemTo.rows < item.rows || itemTo.cols < item.cols) {
        itemTo.cols = itemTo.rows < item.rows ? itemTo.rows : itemTo.cols;
        itemTo.rows = itemTo.cols < item.cols ? itemTo.cols : itemTo.rows;
      }

      if (itemTo.rows > item.rows || itemTo.cols > item.cols) {
        itemTo.cols = itemTo.rows > item.rows ? itemTo.rows : itemTo.cols;
        itemTo.rows = itemTo.cols > item.cols ? itemTo.cols : itemTo.rows;
      }
    }
  }

  /** Comment. */
  ngAfterContentChecked(): void {
    this.ref.detectChanges();
  }

  /**
   * Get station document split.
   */
  private getTreatment(): void {
    const orgRithmId = this.userService.user.organization;
    this.splitService.initSdk(orgRithmId);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.viewNewStation =
          this.splitService.getStationDocumentTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Click for tab selected item inside sub-header.
   *
   * @param headerTabIndex To catch event that verify click tab selected item.
   */
  headerSelectedTab(headerTabIndex: number): void {
    this.headerTabIndex = headerTabIndex;
  }

  /**
   * Whether to show the backdrop for the comment and history drawers.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
  }

  /**
   * Validate the conditions to display the Save or Save Rules button.
   *
   * @returns If display the button, can be true or false.
   */
  get disableSaveButton(): boolean {
    return (
      // If current tab is document and form field values are not changed.
      (!this.isFlowLogicTab &&
        (!this.stationForm.valid ||
          !(
            this.stationForm.dirty ||
            this.stationForm.controls.stationTemplateForm.touched
          ))) ||
      // If current tab is flow and there are no pending flow rules.
      (this.pendingFlowLogicRules.length === 0 && this.isFlowLogicTab)
    );
  }

  /**
   * Whether the screen width is lesser than 640px.
   *
   * @returns True if width is lesser than 640px.
   */
  get isMobileView(): boolean {
    return window.innerWidth <= 640;
  }

  /**
   * Validate the conditions to display the Save or Save Rules button.
   *
   * @returns If display the button, can be true or false.
   */
  get stationInputFrames(): Question[] {
    let dataFiltered = [] as Question[];
    if (this.inputFrameWidgetItems) {
      this.inputFrameWidgetItems.map((frame) => {
        if (frame?.questions && frame.type === FrameType.Input) {
          dataFiltered = dataFiltered.concat(frame.questions);
        }
      });
    }

    return dataFiltered;
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe({
      next: (params) => {
        if (!params.stationId) {
          this.handleInvalidParams();
        } else {
          this.stationRithmId = params.stationId;
          this.getStationInfo(params.stationId);
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
    });
  }

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private handleInvalidParams(): void {
    this.navigateBack();
    this.errorService.displayError(
      'The link you followed is invalid. Please double check the URL and try again.',
      new Error('Invalid params for document')
    );
  }

  /**
   * Navigates the user back to the dashboard page.
   */
  private navigateBack(): void {
    // TODO: [RIT-691] Check which page user came from. If exists and within Rithm, navigate there
    // const previousPage = this.location.getState();
    // If no previous page, go to dashboard
    this.router.navigateByUrl('dashboard');
  }

  /**
   * Get data about the document and station the document is in.
   *
   * @param stationId The id of the station that the document is in.
   */
  private getStationInfo(stationId: string): void {
    this.stationLoading = true;
    this.stationService
      .getStationInfo(stationId)
      .pipe(first())
      .subscribe({
        next: (stationInfo) => {
          if (stationInfo) {
            this.stationInformation = stationInfo;
            this.stationName = stationInfo.name;
            this.stationForm.controls.generalInstructions.setValue(
              stationInfo.instructions
            );
            this.stationService.updateCurrentStationQuestions(
              this.stationInformation.questions
            );
            if (this.viewNewStation) {
              this.getStationWidgets();
            }
          }
          this.resetStationForm();
          this.stationInformation.flowButton = stationInfo.flowButton || 'Flow';
          this.stationLoading = false;
          if (this.viewNewStation) {
            this.stationService.currentStationQuestions$.next(
              this.stationInputFrames
            );
          }
        },
        error: (error: unknown) => {
          this.navigateBack();
          this.stationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Adds selected fieldType to field array.
   *
   * @param fieldType The field to add.
   */
  addQuestion(fieldType: QuestionFieldType): void {
    const newQuestion: Question = {
      rithmId: uuidv4(),
      prompt: '',
      questionType: fieldType,
      isReadOnly: false,
      isRequired: fieldType === QuestionFieldType.Instructions ? true : false,
      isPrivate: false,
      children:
        fieldType === QuestionFieldType.AddressLine
          ? this.addAddressChildren()
          : [],
      originalStationRithmId: this.stationRithmId,
    };
    if (
      fieldType === QuestionFieldType.CheckList ||
      fieldType === QuestionFieldType.Select ||
      fieldType === QuestionFieldType.MultiSelect
    ) {
      newQuestion.possibleAnswers = [];
    }
    this.stationInformation.questions.push(newQuestion);
    this.stationService.touchStationForm();
  }

  /**
   * Save datalink objects when they exists (old interface).
   */
  saveDataLinks(): void {
    const framesForDatalink: StationFrameWidget[] = [];
    /** Build a frame for each existing datalink. */
    this.dataLinkArray.forEach((dl) => {
      const elementRithmId = uuidv4();
      dl.frameRithmId = elementRithmId;
      const frameTemplate = {
        rithmId: elementRithmId,
        stationRithmId: this.stationRithmId,
        cols: 24,
        rows: 4,
        x: 0,
        y: 0,
        type: FrameType.DataLink,
        data: JSON.stringify(dl),
        id: this.inputFrameWidgetItems.length,
      };
      framesForDatalink.push(frameTemplate);
    });
    this.stationService
      .saveDataLinkFrames(this.stationRithmId, framesForDatalink)
      .pipe(first())
      .subscribe({
        next: (frames) => {
          if (frames && frames.length) {
            const requestRow: Observable<DataLinkObject>[] = [];
            Promise.all(
              this.dataLinkArray.map(async (dl) => {
                requestRow.push(
                  this.documentService.saveDataLink(this.stationRithmId, dl)
                );
              })
            );
            this.forkJoinDataLink(requestRow);
          }
        },
        error: (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Execute a fork join to save dataLink.
   *
   * @param requestRow Request row to be executed.
   */
  private forkJoinDataLink(requestRow: Observable<DataLinkObject>[]): void {
    forkJoin(requestRow)
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Save Station information and executed petitions to api.
   *
   */
  saveStationInformation(): void {
    this.stationLoading = true;
    if (this.dataLinkArray.length) {
      this.saveDataLinks();
      this.stationInformation.questions =
        this.stationInformation.questions.filter(
          (q) => q.questionType !== QuestionFieldType.DataLink
        );
    }
    const petitionsUpdateStation = [
      // Update appended fields to document.
      this.stationService.updateDocumentNameTemplate(
        this.stationInformation.rithmId,
        this.appendedFields
      ),

      // Update general instructions.
      this.stationService.updateStationGeneralInstructions(
        this.stationInformation.rithmId,
        this.stationForm.controls.generalInstructions.value
      ),
    ];

    if (this.stationForm.get('stationTemplateForm')?.touched) {
      petitionsUpdateStation.push(
        // Update Questions.
        this.stationService.updateStationQuestions(
          this.stationInformation.rithmId,
          this.stationInformation.questions
        )
      );
    }

    forkJoin(petitionsUpdateStation)
      .pipe(first())
      .subscribe({
        next: ([, , stationQuestions]) => {
          this.stationLoading = false;
          this.stationInformation.name = this.stationName;
          if (stationQuestions) {
            //in case of save/update questions the station questions object is updated.
            this.stationInformation.questions = stationQuestions as Question[];
          }
          this.resetStationForm();
          this.popupService.notify('Station successfully saved');
        },
        error: (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Save flow Logic Rules when is tab FlowLogic.
   *
   */
  saveFlowLogicRules(): void {
    this.childFlowLogic.ruleLoading = true;
    this.documentService
      .saveStationFlowLogic(this.pendingFlowLogicRules)
      .pipe(first())
      .subscribe({
        next: () => {
          this.stationTabsIndex = 1;
          this.pendingFlowLogicRules = [];
          this.childFlowLogic.ruleLoading = false;
          this.resetStationForm();
        },
        error: (error: unknown) => {
          this.stationLoading = false;
          this.stationTabsIndex = 1;
          this.childFlowLogic.ruleLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   *
   * @param documentId The id of the document for which to retrieve previous stations.
   * @param stationId The id of the station for which to retrieve forward stations.
   */
  // private getConnectedStations(documentId: string, stationId: string): void {
  // TODO: new request for connected stations?

  // this.connectedStationsLoading = true;
  // this.documentService.getConnectedStationInfo(documentId, stationId)
  //   .pipe(first())
  //   .subscribe((connectedStations) => {
  //     this.forwardStations = connectedStations.followingStations;
  //     this.previousStations = connectedStations.previousStations;
  //     this.connectedStationsLoading = false;
  //   }, (error: unknown) => {
  //     this.navigateBack();
  //     this.connectedStationsLoading = false;
  //     this.errorService.displayError(
  //       'Failed to get connected stations for this document.',
  //       error,
  //       false
  //     );
  //   });
  // }

  /**
   * Get previous and following stations.
   *
   */
  getPreviousAndNextStations(): void {
    this.stationService
      .getPreviousAndNextStations(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (prevAndNextStations) => {
          if (prevAndNextStations) {
            this.forwardStations = prevAndNextStations.nextStations;
            this.previousStations = prevAndNextStations.previousStations;
          }
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Move previous field from private/all expansion panel to the template area.
   *
   * @param question The question that was moved from private/all.
   */
  movePreviousFieldToTemplate(question: Question): void {
    this.stationInformation.questions.push(question);
    this.stationService.touchStationForm();
  }

  /** This cancel button clicked show alert. */
  async cancelStation(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    });
    if (response) {
      this.router.navigateByUrl('dashboard');
    }
  }

  /**
   * Add children when the parent is an Address field type.
   *
   * @returns Address children questions.
   */
  private addAddressChildren(): Question[] {
    const addressChildren: Question[] = [];
    const children = [
      {
        prompt: 'Address Line 1',
        type: QuestionFieldType.LongText,
        required: true,
      },
      {
        prompt: 'Address Line 2',
        type: QuestionFieldType.LongText,
        required: false,
      },
      { prompt: 'City', type: QuestionFieldType.City, required: true },
      { prompt: 'State', type: QuestionFieldType.State, required: true },
      { prompt: 'Zip', type: QuestionFieldType.Zip, required: true },
    ];
    children.forEach((element) => {
      const child: Question = {
        rithmId: uuidv4(),
        prompt: element.prompt,
        questionType: element.type,
        isReadOnly: false,
        isRequired: element.required,
        isPrivate: false,
        children: [],
        originalStationRithmId: this.stationRithmId,
      };
      addressChildren.push(child);
    });
    return addressChildren;
  }

  /**
   * Detect tabs changed.
   *
   * @param tabChangeEvent Receives the detail from tab selected.
   */
  tabSelectedChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.isFlowLogicTab = tabChangeEvent.index === 1 ? true : false;
  }

  /**
   * Inicializate the edit mode and layout config.
   *
   */
  setEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.setGridMode('layout');
    }
  }

  /**
   * Set the grid mode for station edition.
   *
   * @param mode Value of the grid mode of the toolbarEditStation buttons.
   */
  setGridMode(mode: 'layout' | 'setting' | 'preview'): void {
    let enabledMode = false;
    /** Depending on the case, the mode is set. */
    switch (mode) {
      case 'preview':
        this.editMode = false;
        this.layoutMode = false;
        this.settingMode = false;
        this.isOpenDrawerLeft = false;
        this.closeSettingDrawer();
        this.showTextAlignIcons = false;
        break;
      case 'setting':
        enabledMode = false;
        this.isOpenDrawerLeft = false;
        break;
      case 'layout':
        enabledMode = true;
        this.closeSettingDrawer();
        this.showTextAlignIcons = false;
        break;
      default:
        break;
    }
    this.layoutMode = enabledMode;
    this.settingMode = !enabledMode;

    /* Make the grid visible.*/
    this.options.displayGrid = enabledMode ? 'always' : 'none';
    /* Resizing is performed. */
    if (this.options.resizable) {
      this.options.resizable.enabled = enabledMode;
    }
    /* Rearranges, can be dragged. */
    if (this.options.draggable) {
      this.options.draggable.enabled = enabledMode;
    }
    this.widgetFocused = -1;
    /* Execute changes. */
    this.changedOptions();
  }

  /**
   * Change options in grid.
   *
   */
  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  /**
   * Receives a flow logic rule.
   *
   * @param flowLogicRule Contains a flow logic rules of the current station.
   */
  addFlowLogicRule(flowLogicRule: FlowLogicRule | null): void {
    if (flowLogicRule) {
      const flowLogicStation = this.pendingFlowLogicRules.findIndex(
        (flowRule) =>
          flowRule.destinationStationRithmID ===
            flowLogicRule.destinationStationRithmID &&
          flowRule.stationRithmId === flowLogicRule.stationRithmId
      );
      if (flowLogicStation >= 0) {
        this.pendingFlowLogicRules[flowLogicStation] = flowLogicRule;
      } else {
        this.pendingFlowLogicRules.push(flowLogicRule);
      }
    } else {
      this.pendingFlowLogicRules = [];
    }
  }

  /**
   * Get the station frame widgets.
   */
  private getStationWidgets(): void {
    this.widgetLoading = true;
    this.stationService
      .getStationWidgets(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (inputFrames) => {
          /**Add individual properties for every Type. */
          inputFrames?.forEach((frame, index) => {
            frame.id = index;
            switch (frame.type) {
              case FrameType.Input:
                frame.minItemRows =
                  frame.questions &&
                  frame.questions?.length &&
                  frame.questions?.length > 4
                    ? frame.questions.length
                    : 4;
                frame.minItemCols = 6;
                frame.cols = frame.cols < frame.minItemCols ? 6 : frame.cols;
                frame.rows = frame.rows < frame.minItemRows ? 4 : frame.rows;
                this.inputFrameList.push('inputFrameWidget-' + index);
                break;
              case FrameType.Headline:
                frame.minItemCols = 6;
                frame.maxItemRows = 1;
                frame.type = FrameType.Headline;
                break;
              case FrameType.Body:
                frame.minItemCols = 4;
                frame.minItemRows = 2;
                frame.type = FrameType.Body;
                break;
              case FrameType.Title:
                frame.minItemCols = 6;
                frame.maxItemRows = 1;
                frame.type = FrameType.Title;
                break;
              case FrameType.Image:
                frame.minItemCols = 4;
                frame.minItemRows = 4;
                frame.type = FrameType.Image;
                break;
              case FrameType.CircleImage:
                frame.minItemCols = 4;
                frame.minItemRows = 4;
                frame.type = FrameType.CircleImage;
                break;
              default:
                break;
            }
            this.inputFrameWidgetItems.push(frame);
            this.changedOptions();
          });
          this.stationService.currentStationQuestions$.next(
            this.stationInputFrames
          );
          this.widgetLoading = false;
        },
        error: (error: unknown) => {
          this.widgetLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * This save button clicked show confirm If no questions
   * and Save or update the changes to the station frame widgets.
   */
  async saveStationWidgetChanges(): Promise<void> {
    this.showTextAlignIcons = false;
    let hasQuestions = false;
    this.inputFrameWidgetItems.map((field) => {
      if (field.questions?.length === 0) {
        hasQuestions = true;
      }
    });

    if (hasQuestions) {
      const confirm = await this.popupService.confirm({
        title: ' ',
        message:
          '\nYou have empty input frames, would you like to save anyway?',
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        important: true,
      });
      if (confirm) {
        this.saveStationWidgetsChanges();
        hasQuestions = false;
      }
    } else {
      this.saveStationWidgetsChanges();
    }
  }

  /**
   * Save or update the changes make the station frame widgets.
   */
  private saveStationWidgetsChanges(): void {
    this.widgetLoading = true;
    this.stationService
      .saveStationWidgets(this.stationRithmId, this.inputFrameWidgetItems)
      .pipe(first())
      .subscribe({
        next: () => {
          /** If we get in this section is cause the saved was succeed. If so can keep the same info sent. */
          if (this.inputFrameWidgetItems.length) {
            this.saveInputFrameQuestions(
              this.inputFrameWidgetItems.filter(
                (iframe) => iframe.type === FrameType.Input
              )
            );
          } else {
            this.widgetLoading = false;
            this.setGridMode('preview');
          }
          this.stationService.currentStationQuestions$.next(
            this.stationInputFrames
          );
          this.changedOptions();
        },
        error: (error: unknown) => {
          this.widgetLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Save input frame widgets.
   *
   * @param frames An array of input frameWidgets.
   */
  private saveInputFrameQuestions(frames: StationFrameWidget[]): void {
    if (frames.length) {
      const frameQuestionRequest: Observable<Question[]>[] = [];
      frames.forEach((frame) => {
        if (frame.questions?.length) {
          frameQuestionRequest.push(
            this.stationService.saveInputFrameQuestions(
              frame.rithmId,
              frame.questions
            )
          );
        }
      });
      this.forkJoinFrameQuestions(frameQuestionRequest);
    } else {
      this.widgetLoading = false;
      this.setGridMode('preview');
    }
  }

  /**
   * Execute a fork join to save input frame questions.
   *
   * @param requestRow Request row to be executed.
   */
  private forkJoinFrameQuestions(requestRow: Observable<Question[]>[]): void {
    forkJoin(requestRow)
      .pipe(first())
      .subscribe({
        next: () => {
          this.widgetLoading = false;
          this.setGridMode('preview');
        },
        error: (error: unknown) => {
          this.widgetLoading = false;
          this.setGridMode('preview');
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /** This cancel button clicked show alert. */
  async cancelStationChanges(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Cancel?',
      message: '\nUnsaved changes will be lost.',
      okButtonText: 'Yes',
      cancelButtonText: 'No',
      important: true,
    });
    if (confirm) {
      this.editMode = false;
      this.setGridMode('preview');
      this.showTextAlignIcons = false;
    }
  }

  /** Remove widgets from the gridster in layout mode. */
  async removeWidgets(): Promise<void> {
    if (this.widgetFocused > -1) {
      const confirmRemove = await this.popupService.confirm({
        title: 'Remove widget?',
        message: '\nThe selected widget will be removed.',
        okButtonText: 'Yes',
        cancelButtonText: 'No',
        important: true,
      });
      if (confirmRemove) {
        this.inputFrameWidgetItems.splice(this.widgetFocused, 1);
        this.widgetFocused = -1;
      }
    }
  }

  /**
   * Will add a new input frame in the station grid.
   *
   * @param type Information referent to widget selected.
   */
  addInputFrame(
    type: CdkDragDrop<string, string, FrameType> | FrameType
  ): void {
    const inputFrame: StationFrameWidget = {
      rithmId: uuidv4(),
      stationRithmId: this.stationRithmId,
      cols: 1,
      rows: 1,
      x: 0,
      y: 0,
      type: FrameType.Input,
      data: '',
      id: this.inputFrameWidgetItems.length,
    };

    /**
     * Identify typeof type, in case is emitted by CdkDragDrop it
     * gonna be an object and in case comes from a click method it will be a string.
     */
    const value: string = typeof type === 'string' ? type : type.item.data;

    /**Add individual properties for every Type. */
    switch (value) {
      case FrameType.Input:
        inputFrame.cols = 6;
        inputFrame.rows = 4;
        inputFrame.minItemRows = 4;
        inputFrame.minItemCols = 6;
        inputFrame.questions = [];
        this.inputFrameList.push('inputFrameWidget-' + inputFrame.id);
        break;
      case FrameType.Headline:
        inputFrame.cols = 24;
        inputFrame.rows = 1;
        inputFrame.minItemCols = 6;
        inputFrame.maxItemRows = 1;
        inputFrame.type = FrameType.Headline;
        break;
      case FrameType.Body:
        inputFrame.cols = 6;
        inputFrame.rows = 2;
        inputFrame.minItemCols = 4;
        inputFrame.minItemRows = 2;
        inputFrame.type = FrameType.Body;
        break;
      case FrameType.Title:
        inputFrame.cols = 24;
        inputFrame.rows = 1;
        inputFrame.minItemCols = 6;
        inputFrame.maxItemRows = 1;
        inputFrame.type = FrameType.Title;
        break;
      case FrameType.Image:
        inputFrame.cols = 4;
        inputFrame.rows = 4;
        inputFrame.minItemCols = 4;
        inputFrame.minItemRows = 4;
        inputFrame.type = FrameType.Image;
        break;
      case FrameType.CircleImage:
        inputFrame.cols = 4;
        inputFrame.rows = 4;
        inputFrame.minItemCols = 4;
        inputFrame.minItemRows = 4;
        inputFrame.type = FrameType.CircleImage;
        break;
      default:
        break;
    }

    this.inputFrameWidgetItems.push(inputFrame);
  }

  /**
   * Toggles the open state for drawer mode.
   */
  toggleLeftDrawer(): void {
    this.isOpenDrawerLeft = !this.isOpenDrawerLeft;
    if (this.settingMode) {
      this.setGridMode('layout');
      this.showTextAlignIcons = false;
    }
  }

  /**
   * Open the right setting drawer for field setting.
   *
   * @param field The field information for the setting drawer through sidenavDrawerService.
   * @param type The frame information for the setting drawer through sidenavDrawerService.
   */
  openSettingDrawer(
    field: Question | ImageWidgetObject | string,
    type: FrameType
  ): void {
    this.showTextAlignIcons = false;
    /** If the left drawer is open, it must be closed. */
    if (this.isOpenDrawerLeft) {
      this.isOpenDrawerLeft = false;
    }

    const dataDrawer: SettingDrawerData = {
      field,
      frame: type,
    };
    this.sidenavDrawerService.openDrawer('fieldSetting', dataDrawer);
  }

  /**
   * Close the right setting drawer for field setting.
   */
  closeSettingDrawer(): void {
    /** If both are open, the field setting drawer must be closed. */
    if (
      this.sidenavDrawerService.isDrawerOpen &&
      this.drawerContext === 'fieldSetting'
    ) {
      this.sidenavDrawerService.closeDrawer();
    }
  }

  /**
   * Will track each gridster item.
   *
   * @param index Gridster item index.
   * @param item Gridster item.
   * @returns Gridster item id.
   */
  trackBy(index: number, item: GridsterItem): number {
    return item.id;
  }

  /**
   * Allow to select/unselect any clicked widget.
   *
   * @param index The index of the selected widget.
   */
  focusWidget(index: number): void {
    this.widgetFocused = index === this.widgetFocused ? -1 : index;
    if (this.widgetFocused !== -1 && this.settingMode) {
      if (
        this.textWidgetTypes.includes(
          this.inputFrameWidgetItems[this.widgetFocused].type
        )
      ) {
        this.showTextAlignIcons = true;
      }
    } else {
      this.showTextAlignIcons = false;
    }
  }

  /**
   * Add row at widget current.
   *
   * @param height The new height of widget.
   * @param widget The widget selected.
   */
  widgetRowAdjustment(height: number, widget: StationFrameWidget): void {
    if (height > widget.rows) {
      widget.rows = height;
      widget.minItemRows = height;

      /**Set in gridster properties to avoid overlapping widgets. */
      const itemResized = new GridsterPush(
        this.gridItem.gridster.grid[widget.id]
      );
      this.gridItem.gridster.grid[widget.id].$item.rows = height;

      if (itemResized.pushItems(itemResized.fromNorth)) {
        // push items from a direction
        itemResized.checkPushBack(); // check for items can restore to original position
        itemResized.setPushedItems(); // save the items pushed
        this.gridItem.gridster.grid[widget.id].setSize();
        this.gridItem.gridster.grid[widget.id].checkItemChanges(
          this.gridItem.gridster.grid[widget.id].$item,
          this.gridItem.gridster.grid[widget.id].item
        );
      }
      itemResized.destroy();
    }
    this.changedOptions();
  }

  /**
   * Resets the station form.
   */
  private resetStationForm() {
    setTimeout(() => {
      this.stationForm.markAsPristine();
      this.stationForm.controls.stationTemplateForm.markAsUntouched();
    }, 0);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
