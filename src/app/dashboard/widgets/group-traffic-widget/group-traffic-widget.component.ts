import { Component, Input, OnInit } from '@angular/core';
/**
 * Component for station group stations.
 */
@Component({
  selector: 'app-group-traffic-widget[showButtonSetting][dataWidget][editMode]',
  templateUrl: './group-traffic-widget.component.html',
  styleUrls: ['./group-traffic-widget.component.scss'],
})
export class GroupTrafficWidgetComponent implements OnInit {
  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Set data for group traffic widget. */
  @Input() dataWidget!: string;

  /** StationGroupRithmId for station groups traffic widget. */
  stationGroupRithmId = '';

  /**
   * Initial Method.
   */
  ngOnInit(): void {
    const dataWidget = JSON.parse(this.dataWidget);
    this.stationGroupRithmId = dataWidget.stationGroupRithmId;
  }
}
