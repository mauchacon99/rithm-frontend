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
  InputFrameWidget,
} from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { StationService } from 'src/app/core/station.service';
import { PopupService } from 'src/app/core/popup.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentService } from 'src/app/core/document.service';
import { FlowLogicComponent } from 'src/app/station/flow-logic/flow-logic.component';

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

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Get station name from behaviour subject. */
  private stationName = '';

  /** Station form. */
  stationForm: FormGroup;

  /** The information about the station. */
  stationInformation!: StationInformation;

  /** Station Rithm id. */
  stationRithmId = '';

  /** Index for station tabs. */
  stationTabsIndex = 0;

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

  /** Grid initial values. */
  options: GridsterConfig = {
    gridType: 'scrollVertical',
    displayGrid: 'always',
    pushItems: true,
    draggable: {
      enabled: true,
    },
    resizable: {
      enabled: true,
    },
    margin: 12,
    minCols: 24,
    maxCols: 24,
  };

  inputFrameWidgetItems: InputFrameWidget[] = [];

  /** Loading / Error variables. */

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

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
    this.stationService.stationFormTouched$.pipe(first()).subscribe(() => {
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
   * Listen the flowButtonText subject.
   */
  private subscribeFlowButtonText(): void {
    this.stationService.flowButtonText$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (this.stationInformation) {
          this.stationInformation.flowButton = data.length ? data : 'Flow';
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
    this.subscribeFlowButtonText();

    if (!this.editMode) this.setGridMode('preview');
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
   * Generate a random rithmId to added fields.
   *
   * @returns Random RithmId.
   */
  private get randRithmId(): string {
    const genRanHex = (size: number) =>
      [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
    const rithmId = `${genRanHex(4)}-${genRanHex(4)}-${genRanHex(4)}`;
    return rithmId;
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
      (!this.stationForm.valid &&
        !(
          !this.stationForm.dirty ||
          !this.stationForm.controls.stationTemplateForm.touched
        )) ||
      (this.pendingFlowLogicRules.length === 0 && this.isFlowLogicTab)
    );
  }

  /**
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params.pipe(first()).subscribe({
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
            // this.inputFrameWidgetItems[0].questions =
            //   this.stationInformation.questions;
            /** Update the current station questions whenever it changes. */
            this.stationService.updateCurrentStationQuestions(
              this.stationInformation.questions
            );
          }
          this.stationInformation.flowButton = stationInfo.flowButton || 'Flow';
          this.stationLoading = false;
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
      rithmId: this.randRithmId,
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
   * Save Station information and executed petitions to api.
   *
   */
  saveStationInformation(): void {
    this.stationLoading = true;
    const petitionsUpdateStation = [
      // Update station Name.
      this.stationService.updateStationName(
        this.stationName,
        this.stationInformation.rithmId
      ),

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

      // Update flow button text.
      this.stationService.updateFlowButtonText(
        this.stationInformation.rithmId,
        this.stationInformation.flowButton
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
        next: ([, , , , stationQuestions]) => {
          this.stationLoading = false;
          this.stationInformation.name = this.stationName;
          if (stationQuestions) {
            //in case of save/update questions the station questions object is updated.
            this.stationInformation.questions = stationQuestions as Question[];
          }
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
   * Comment.
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
        rithmId: this.randRithmId,
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
    const enabledMode = mode === 'layout' ? true : false;
    /* If it is different from preview, we are in editable mode. */
    if (mode !== 'preview') {
      this.layoutMode = enabledMode;
      this.settingMode = !enabledMode;
    } else {
      this.layoutMode = false;
      this.settingMode = false;
    }

    /*If the parameter 'mode' is different 'layout' hidden the drawer left.*/
    if (mode !== 'layout') {
      this.isOpenDrawerLeft = false;
    }

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
   * Save the changes make in the gridster.
   */
  saveStationChanges(): void {
    this.editMode = false;
    this.setGridMode('preview');
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
    }
  }

  /** Remove widgets from the gridster in layout mode. */
  removeWidgets(): void {
    this.inputFrameWidgetItems.length = 0;
  }

  /**
   * Will add a new input frame in the station grid.
   */
  addInputFrame(): void {
    const inputFrame: InputFrameWidget = {
      frameRithmId: '',
      cols: 6,
      rows: 4,
      x: 0,
      y: 0,
      minItemRows: 4,
      minItemCols: 6,
      questions: [],
      type: '',
      data: '',
      id: this.inputFrameWidgetItems.length,
    };
    this.inputFrameWidgetItems.push(inputFrame);
    this.inputFrameList.push('inputFrameWidget-' + inputFrame.id);
  }

  /**
   * Toggles the open state for drawer mode.
   */
  toggleLeftDrawer(): void {
    this.isOpenDrawerLeft = !this.isOpenDrawerLeft;
    if (this.settingMode) {
      this.setGridMode('layout');
    }
  }

  /**
   * Toggles the open state of the right setting drawer.
   */
  toggleRightDrawer(): void {
    this.sidenavDrawerService.openDrawer('fieldSetting');
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
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
