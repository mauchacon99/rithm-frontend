import { Component, Input, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UserService } from 'src/app/core/user.service';
import { StationRosterMember } from 'src/models';
/**
 * Component for station prebuilt.
 */
@Component({
  selector: 'app-station-pre-built-widget',
  templateUrl: './station-pre-built-widget.component.html',
  styleUrls: ['./station-pre-built-widget.component.scss'],
})
export class StationPreBuiltWidgetComponent implements OnInit {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /*User station data. */
  userStations: StationRosterMember[] = [];

  constructor(
    private stationService: StationService,
    private errorService: ErrorService,
    private userService: UserService
  ) {}

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    this.getUserStationData();
  }

  /**
   * Get user stations.
   *
   */
  getUserStationData(): void {
    this.stationService
      .getUserStationData(this.userService.user.rithmId)
      .pipe(first())
      .subscribe({
        next: (userStations) => {
          this.userStations = userStations;
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
