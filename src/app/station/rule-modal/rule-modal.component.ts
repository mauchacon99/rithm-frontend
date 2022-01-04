import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConnectedStationInfo } from "src/models";

/**
 * Reusable component for displaying the information to add a new rule.
 */
@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public rithmId: string
  ) { console.log(rithmId) }

}
