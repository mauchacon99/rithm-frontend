import { Component, Input, OnInit } from '@angular/core';

/**
 * Component for displaying a card with station information.
 */
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent implements OnInit{
  /** The name of the station. */
  @Input() stationName = 'Station name';

  /** Total number of documents in the station. */
  @Input() totalDocs = 5;

  /** Members initials of the station worker roster. */
  @Input() roster = [
    {
      initials: 'AB'
    },
    {
      initials: 'SR'
    },
    {
      initials: 'TS'
    },
    {
      initials: 'TS'
    }
  ];

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if(this.roster.length <= 3) {
      this.slices = this.roster.length;
    }
  }

}
