import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';

/**
 * Main component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dialog.open(RosterModalComponent, {
      minWidth: '325px'
    });
  }

}
