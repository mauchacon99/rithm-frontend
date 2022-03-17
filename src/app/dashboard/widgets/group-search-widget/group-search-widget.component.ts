import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';

/**
 * Component for list field the groups how widget.
 */
@Component({
  selector:
    'app-group-search-widget[dataWidget][editMode][showButtonSetting][widgetType]',
  templateUrl: './group-search-widget.component.html',
  styleUrls: ['./group-search-widget.component.scss'],
})
export class GroupSearchWidgetComponent {
  /** To load dom by WidgetType. */
  @Input() widgetType: WidgetType = WidgetType.StationGroup;

  /** Edit mode toggle from dashboard. */
  @Input() editMode = false;

  /** Show setting button widget. */
  @Input() showButtonSetting = false;

  /** Data widget. */
  private _dataWidget = '';

  /** Set data for group widget. */
  @Input() set dataWidget(value: string) {
    this._dataWidget = value;
  }
}
