import { Component, Input, OnInit } from '@angular/core';
import { ConnectedStationInfo, FlowLogicRule } from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { RuleModalComponent } from 'src/app/station/rule-modal/rule-modal.component';
import { StationService } from 'src/app/core/station.service';
import { ErrorService } from 'src/app/core/error.service';
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

  /** The station Flow Logic Rule. */
  stationFlowLogic: FlowLogicRule[] = [];

  /* Loading the list of stations flow logic*/
  flowLogicLoading = true;

  /** The error if rules fails . */
  flowRuleError = false;

  constructor(
    private dialog: MatDialog,
    private stationService: StationService,
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
   */
  async openModal(): Promise<void> {
    const dialog = await this.dialog.open(RuleModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      data: this.rithmId,
    });
    if (dialog) {
      // handle returned rule
    } else {
      // handle error
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
          this.stationFlowLogic = stationFlowLogic;
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
}
