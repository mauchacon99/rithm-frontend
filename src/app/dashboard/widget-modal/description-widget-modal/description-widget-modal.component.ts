import { Component, Input, OnInit } from '@angular/core';
import { SelectedItemWidgetModel, WidgetType } from 'src/models';
import { DashboardService } from '../../dashboard.service';

/** Description widget modal. */
@Component({
  selector: 'app-description-widget-modal[itemWidgetModalSelected]',
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

  constructor(private dashboardService:DashboardService){}

  /** Initial method. */
  ngOnInit(): void {
    this.dataDescriptionTemplate = this.dashboardService.dataDescriptionTemplate[widgetType];
    this.dataWidget = JSON.stringify({
      documentRithmId:this.itemWidgetModalSelected.itemList.rithmId,
      columns:[]
    });
  }
}
