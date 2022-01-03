import { Component,Input } from '@angular/core';
import { ConnectedStationInfo } from 'src/models';
import {first} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {RuleModalComponent} from "../rule-modal/rule-modal.component";

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

   constructor(private dialog: MatDialog) { }

   /**
    * Open a modal rule-modal.
    *
    * @param station The object of model ConnectedStationInfo.
    */
   openModal(station: ConnectedStationInfo): void {
    const dialog = this.dialog.open(RuleModalComponent, {
      panelClass: ['w-5/6', 'sm:w-4/5'],
      maxWidth: '1024px',
      disableClose: true,
      data: { station }
    });
    dialog.afterClosed().pipe(first()).subscribe();
   }

}
