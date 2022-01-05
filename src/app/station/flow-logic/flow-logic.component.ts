import { Component, Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models';
import { MatDialog } from "@angular/material/dialog";
import { RuleModalComponent } from "src/app/station/rule-modal/rule-modal.component";

/**
 * Component for the flow logic tab on a station.
 */
@Component({
  selector: 'app-flow-logic[nextStations]',
  templateUrl: './flow-logic.component.html',
  styleUrls: ['./flow-logic.component.scss']
})
export class FlowLogicComponent {

  /** The list of stations to display in the pane. */
  @Input() nextStations: ConnectedStationInfo[] = [];

  /** Station Rithm id. */
  @Input() rithmId = '';

  constructor(private dialog: MatDialog) {
  }

  /**
   * Open a modal rule-modal.
   */
  async openModal(): Promise<void> {
    const dialog = await this.dialog.open(RuleModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      data: this.rithmId
    });
    if (dialog) {
      // handle returned rule
    } else {
      // handle error
    }
  }

}
