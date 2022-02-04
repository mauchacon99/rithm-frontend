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
} from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StationService } from 'src/app/core/station.service';
import { forkJoin, Subject } from 'rxjs';
import { PopupService } from 'src/app/core/popup.service';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';

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
  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Station form. */
  stationForm: FormGroup;

  /** The information about the station. */
  stationInformation!: StationInformation;

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** The list of stations that follow this station. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that precede this station. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** Show Hidden accordion field private. */
  accordionFieldPrivateExpanded = false;

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  /** Show Hidden accordion all field. */
  accordionFieldAllExpanded = false;

  /** Station Rithm id. */
  stationRithmId = '';

  /** Get station name from behaviour subject. */
  private stationName = '';

  /** Appended Fields array. */
  appendedFields: DocumentNameField[] = [];

  /** View new station. */
  viewNewStation = false;

  constructor(
    private stationService: StationService,
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

    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.drawerContext = context;
      });

    this.stationService.stationName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((stationName) => {
        this.stationName = stationName;
      });

    this.stationService.documentStationNameFields$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((appFields) => {
        this.appendedFields = appFields;
      });

    this.stationService.stationFormTouched$.pipe(first()).subscribe(() => {
      this.stationForm.get('stationTemplateForm')?.markAsTouched();
    });

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
    const newAnswer: PossibleAnswer = {
      rithmId: answer.originalStationRithmId
        ? answer.originalStationRithmId
        : '',
      text: answer.prompt,
      default: false,
    };
    if (
      this.stationInformation.questions[questionIndex].possibleAnswers !==
      undefined
    ) {
      const possibleAnswer = arrayAnswers.find(
        (a) => a.rithmId === newAnswer.rithmId
      );
      if (possibleAnswer) {
        const answerIndex = arrayAnswers.indexOf(possibleAnswer);
        arrayAnswers[answerIndex] = newAnswer;
        this.stationInformation.questions[questionIndex].possibleAnswers =
          arrayAnswers;
      } else {
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
        const treatment = this.splitService.getStationDocumentTreatment();
        this.viewNewStation = treatment === 'on';
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
          }
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
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
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
        next: (data) => {
          this.stationLoading = false;
          this.stationInformation.name = this.stationName;
          if (data[3]) {
            //in case of save/update questions the station questions object is updated.
            this.stationInformation.questions = data[3] as Question[];
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
}
