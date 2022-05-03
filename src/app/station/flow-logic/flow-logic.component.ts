import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ConnectedStationInfo,
  FlowLogicRule,
  Rule,
  RuleEquation,
  RuleType,
  Station,
} from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { RuleModalComponent } from 'src/app/station/rule-modal/rule-modal.component';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { first, map, Observable, startWith } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';
import { OperatorType } from 'src/models/enums/operator-type.enum';
import { SplitService } from 'src/app/core/split.service';
import { UserService } from 'src/app/core/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StationService } from 'src/app/core/station.service';

/**
 * Component for the flow logic tab on a station.
 */
@Component({
  selector: 'app-flow-logic[nextStations]',
  templateUrl: './flow-logic.component.html',
  styleUrls: ['./flow-logic.component.scss'],
})
export class FlowLogicComponent implements OnInit {
  /** The list of stations to display in the pane. */
  @Input() nextStations: ConnectedStationInfo[] = [];

  /** Station Rithm id. */
  @Input() rithmId = '';

  /** The modified Flow Logic Rule to send back to station. */
  @Output() modifiedFlowRules = new EventEmitter<FlowLogicRule | null>();

  /** Allow switch between new/old interface. */
  flowLogicView = false;

  /** The station Flow Logic Rule. */
  flowLogicRules: FlowLogicRule[] = [];

  /* Loading the rules list  by type  */
  flowLogicLoadingByRuleType: string | null = null;

  /** Contains the new flow logic rule for saved . */
  newFlowLogic!: FlowLogicRule;

  /** Determine what menu is currently selected. */
  ruleSelectedMenu: 'triggers' | 'rules' = 'triggers';

  /** Tooltip. */
  manuallyTooltip =
    'Upon pressing the flow button, containers will be checked and flowed to their destination';

  /** Selected value condition type for rules. */
  selectedConditionType = 'all';

  /** Lading/Errors block. */
  /* Loading the list of rules of flow logic*/
  ruleLoading = false;

  /* Loading the list of stations flow logic*/
  flowLogicLoading = true;

  /** The error if rules fails . */
  ruleError = false;

  /** The error if rules fails . */
  flowRuleError = false;

  /**Filtered form station List. */
  filteredStations$: Observable<Station[]> | undefined;

  /** The form to add this field in the template. */
  flowFieldForm!: FormGroup;

  /** The list of all stations. */
  stations: Station[] = [];

  /** Loading/Errors block. */
  /* Loading in input auto-complete the list of all stations. */
  stationLoading = false;

  constructor(
    public dialog: MatDialog,
    private popupService: PopupService,
    private errorService: ErrorService,
    private documentService: DocumentService,
    private userService: UserService,
    private splitService: SplitService,
    private fb: FormBuilder,
    private stationService: StationService
  ) {}

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getTreatment();
    this.getStationFlowLogicRule();

    this.flowFieldForm = this.fb.group({
      stations: [''],
    });
  }

  /**
   * Get station document split.
   */
  private getTreatment(): void {
    const orgRithmId = this.userService.user.organization;
    this.splitService.initSdk(orgRithmId);
    this.splitService.sdkReady$.pipe(first()).subscribe({
      next: () => {
        this.flowLogicView = this.splitService.getFlowLogicTreatment() === 'on';
      },
      error: (error: unknown) => {
        this.errorService.logError(error);
      },
    });
  }

  /**
   * Open a modal rule-modal.
   *
   * @param type If the rule to add is AND/OR type.
   * @param connectedStationId The connected station to create the rule.
   * @param editRule The rule to be edited, optional value.
   * @param eqIndex The equation to be updated.
   */
  async openModal(
    type: string,
    connectedStationId: string,
    editRule?: RuleEquation,
    eqIndex = 0
  ): Promise<void> {
    const dialog = await this.dialog.open(RuleModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      data: {
        stationId: this.rithmId,
        editRule: editRule || null,
      },
      disableClose: true,
    });
    if (dialog) {
      dialog
        .afterClosed()
        .pipe(first())
        .subscribe((data) => {
          if (data) {
            const equation = data.rule;
            const flowLogicStation = this.flowLogicRules.find(
              (station) =>
                station.destinationStationRithmID === connectedStationId
            );
            const flowLogic: FlowLogicRule = {
              stationRithmId: this.rithmId,
              destinationStationRithmID: connectedStationId,
              flowRule: {
                ruleType: RuleType.And,
                equations: [],
                subRules: [],
              },
            };
            const subRule: Rule = {
              ruleType: RuleType.Or,
              equations: [equation],
              subRules: [],
            };
            if (!data.editMode) {
              if (!flowLogicStation) {
                // add a flowLogicRule with this connectedStation to the FlowLogicRule array
                if (type === 'all') {
                  flowLogic.flowRule.equations.push(equation);
                } else {
                  flowLogic.flowRule.subRules.push(subRule);
                }
                this.flowLogicRules.push(flowLogic);
                this.modifiedFlowRules.emit(flowLogic);
              } else {
                // Update the flowRules if the station exists in the FlowLogicRule array
                if (type === 'all') {
                  flowLogicStation.flowRule.equations.push(equation);
                } else {
                  flowLogicStation.flowRule.subRules.push(subRule);
                }
                this.modifiedFlowRules.emit(flowLogicStation);
              }
            } else {
              if (flowLogicStation) {
                if (type === 'all') {
                  flowLogicStation.flowRule.equations[eqIndex] = equation;
                } else {
                  flowLogicStation.flowRule.subRules[eqIndex] = subRule;
                }
                this.modifiedFlowRules.emit(flowLogicStation);
              }
            }
          }
        });
    }
  }

  /**
   * Get each station flow rules.
   */
  private getStationFlowLogicRule(): void {
    this.documentService
      .getStationFlowLogicRule(this.rithmId)
      .pipe(first())
      .subscribe({
        next: (stationFlowLogic) => {
          this.flowLogicLoading = false;
          this.flowLogicRules = stationFlowLogic;
        },
        error: (error: unknown) => {
          this.flowRuleError = true;
          this.flowLogicLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update each station flow logic rules.
   */
  private updateStationFlowLogicRule(): void {
    this.documentService
      .updateStationFlowLogicRule(this.flowLogicRules)
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.flowRuleError = true;
          this.flowLogicLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Return the flowRule Object of the currentStation if exist.
   *
   * @param connectedStationId The id of each station connected to the FlowLogicRule.
   * @returns And emptyByDefault or existing RuleObject.
   */
  getStationFlowRules(connectedStationId: string): Rule {
    const defaultRule: Rule = {
      ruleType: RuleType.And,
      equations: [],
      subRules: [],
    };
    const rule = this.flowLogicRules.find(
      (station) => station.destinationStationRithmID === connectedStationId
    )?.flowRule;
    return rule ? rule : defaultRule;
  }

  /**
   * Delete rule from station flow logic.
   *
   * @param index The index of each rule.
   * @param type If the rule to add is AND/OR type.
   * @param connectedStationId The connected station to create the rule.
   */
  async deleteRuleFromStationFlowLogic(
    index: number,
    type: string,
    connectedStationId: string
  ): Promise<void> {
    const confirm: boolean = await this.popupService.confirm({
      title: 'Remove Rule',
      message: `Are you sure to remove the selected rule from this station?`,
      okButtonText: 'Remove',
    });
    if (confirm) {
      const flowLogicRules = this.flowLogicRules.find(
        (station) => station.destinationStationRithmID === connectedStationId
      );
      if (flowLogicRules) {
        this.flowLogicLoadingByRuleType = `${connectedStationId}-${type}`;

        // cloning variable without memory
        const flowLogicRulesCopy = JSON.parse(JSON.stringify(flowLogicRules));

        // prepare the data to send the endpoint and for later
        // remove the rule from the  array  flowLogicRulesCopy when is 'any' or 'all'
        if (type === 'all')
          flowLogicRulesCopy?.flowRule.equations.splice(index, 1);
        else flowLogicRulesCopy?.flowRule.subRules.splice(index, 1);

        this.documentService
          .deleteRuleFromStationFlowLogic([flowLogicRulesCopy])
          .pipe(first())
          .subscribe({
            next: () => {
              // remove the rule from the  array flowLogicRules when is 'any' or 'all'
              if (type === 'all') {
                flowLogicRules?.flowRule.equations.splice(index, 1);
              } else {
                flowLogicRules?.flowRule.subRules.splice(index, 1);
              }
              this.flowLogicLoadingByRuleType = null;
              this.modifiedFlowRules.emit(null);
            },
            error: (error: unknown) => {
              this.flowRuleError = true;
              this.flowLogicLoading = false;
              this.flowLogicLoadingByRuleType = null;
              this.errorService.displayError(
                "Something went wrong on our end and we're looking into it. Please try again in a little while.",
                error
              );
            },
          });
      }
    }
  }

  /**
   * Translate the operator from Math to natural.
   *
   * @param operator The operator to be translated.
   * @returns The translation for the current operator.
   */
  translateOperator(operator: string): string {
    let operatorTranslated = '';
    switch (operator) {
      case OperatorType.GreaterThan:
        operatorTranslated = 'is greater than';
        break;
      case OperatorType.LesserThan:
        operatorTranslated = 'is less than';
        break;
      case OperatorType.GreaterOrEqual:
        operatorTranslated = 'is greater than or equal to';
        break;
      case OperatorType.LesserOrEqual:
        operatorTranslated = 'is lesser than or equal to';
        break;
      case OperatorType.EqualTo:
        operatorTranslated = 'is';
        break;
      case OperatorType.NotEqualTo:
        operatorTranslated = 'is not';
        break;
      case OperatorType.Before:
        operatorTranslated = 'before';
        break;
      case OperatorType.After:
        operatorTranslated = 'after';
        break;
      case OperatorType.Contains:
        operatorTranslated = 'contains';
        break;
      case OperatorType.NotContains:
        operatorTranslated = 'does not contains';
        break;
      case OperatorType.On:
        operatorTranslated = 'on';
        break;
    }
    return operatorTranslated;
  }

  /**
   * Get the list of all stations.
   */
  getAllStations(): void {
    this.stationLoading = true;
    this.stationService
      .getAllStations()
      .pipe(first())
      .subscribe({
        next: (stations) => {
          this.stations = stations;
          this.filterStations();
          this.stationLoading = false;
        },
        error: (error: unknown) => {
          this.stationLoading = false;
          this.errorService.displayError(
            'Failed to get all stations for this data link field.',
            error,
            false
          );
        },
      });
  }

  /**
   * Filter the list of all stations.
   */
  private filterStations(): void {
    /** Set the filter List for auto searching. */
    this.filteredStations$ =
      this.flowFieldForm.controls.stations.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
  }

  /**
   * Filtered Values.
   *
   * @param value Current String in Field Forms.
   * @returns Filtered value.
   */
  private _filter(value: string): Station[] {
    const filterValue = value?.toLowerCase();
    return this.stations.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
