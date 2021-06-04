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
  @Input() stationName = 'Station name';

  @Input() totalDocs = 5;

  @Input() roster = [
    {
      initials: 'AB'
    },
    {
      initials: 'SR'
    },
    {
      initials: 'TS'
    }
  ];

  showAll = false;

  constructor() {
    console.log(this.roster);
  }

  ngOnInit(): void {
    if(this.roster.length <= 3) {
      this.showAll = true;
    }
  }

}
