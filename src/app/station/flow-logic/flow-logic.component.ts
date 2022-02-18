import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ConnectedStationInfo,
  FlowLogicRule,
  Rule,
  RuleType,
} from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { RuleModalComponent } from 'src/app/station/rule-modal/rule-modal.component';
import { ErrorService } from 'src/app/core/error.service';
import { PopupService } from 'src/app/core/popup.service';
import { first } from 'rxjs';
import { DocumentService } from 'src/app/core/document.service';

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
  @Output() modifiedFlowRules = new EventEmitter<FlowLogicRule>();

  /** The station Flow Logic Rule. */
  flowLogicRules: FlowLogicRule[] = [];

  /* Loading the list of stations flow logic*/
  flowLogicLoading = true;

  /** The error if rules fails . */
  flowRuleError = false;

  /** Contains the new flow logic rule for saved . */
  newFlowLogic!: FlowLogicRule;

  constructor(
    public dialog: MatDialog,
    private popupService: PopupService,
    private errorService: ErrorService,
    private documentService: DocumentService
  ) {}

  /**
   * Life cycle init the component.
   */
  ngOnInit(): void {
    this.getStationFlowLogicRule();
  }

  /**
   * Open a modal rule-modal.
   *
   * @param type If the rule to add is AND/OR type.
   * @param connectedStationId The connected station to create the rule.
   */
  async openModal(type: string, connectedStationId: string): Promise<void> {
    const dialog = await this.dialog.open(RuleModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      data: this.rithmId,
      disableClose: true,
    });
    if (dialog) {
      dialog
        .afterClosed()
        .pipe(first())
        .subscribe((equation) => {
          if (equation) {
            const flowLogicStation = this.flowLogicRules.find(
              (station) =>
                station.destinationStationRithmID === connectedStationId
            );
            const subRule: Rule = {
              ruleType: RuleType.Or,
              equations: [equation],
              subRules: [],
            };
            if (!flowLogicStation) {
              // add a flowLogicRule with this connectedStation to the FlowLogicRule array
              const flowLogic: FlowLogicRule = {
                stationRithmId: this.rithmId,
                destinationStationRithmID: connectedStationId,
                flowRule: {
                  ruleType: RuleType.And,
                  equations: [],
                  subRules: [],
                },
              };
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
   */
  async deleteRuleFromStationFlowLogic(): Promise<void> {
    const confirm: boolean = await this.popupService.confirm({
      title: 'Remove Rule',
      message: `Are you sure to remove the selected rule from this station?`,
      okButtonText: 'Remove',
    });
    if (confirm) {
      this.documentService
        .deleteRuleFromStationFlowLogic(this.flowLogicRules)
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
  }
}
