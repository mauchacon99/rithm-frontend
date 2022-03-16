import { Component, Input } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { Console } from 'console';

/** Description widget modal. */
@Component({
  selector: 'app-description-widget-modal[itemWidgetModalSelected][widgetType]',
  templateUrl: './description-widget-modal.component.html',
  styleUrls: ['./description-widget-modal.component.scss'],
})
export class DescriptionWidgetModalComponent implements OnInit{

  /** Widget item selected. */
  @Input() itemWidgetModalSelected!: SelectedItemWidgetModel;

  /** Data Description for description-widget-modal.  */
   dataDescriptionTemplate!:unknown;

  /** Data widget for app-document-widget. */
  dataWidget!:string;

  /** Widget type to preview widget selected. */
  @Input() widgetType!: WidgetType | 'defaultDocument';

  /** Data static for each template by widgetType. */
  dataTemplate;

  constructor(private dashboardService: DashboardService) {
    this.dataTemplate = dashboardService.dataTemplatePreviewWidgetModal;
    this.dataDescriptionTemplate = this.dashboardService.dataDescriptionTemplate;
    console.log(this.dataDescriptionTemplate);
  }

  /** Initial method. */
  ngOnInit(): void {

    this.dataWidget = JSON.stringify({
      documentRithmId:this.itemWidgetModalSelected.itemList.rithmId,
      columns:[]
    });

}
