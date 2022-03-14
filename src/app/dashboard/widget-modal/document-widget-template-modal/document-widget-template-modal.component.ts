import { Component, Input } from '@angular/core';
import { WidgetType } from 'src/models';

/**
 * The component for templates widgets of the document.
 */
@Component({
  selector: 'app-document-widget-template-modal[widgetType]',
  templateUrl: './document-widget-template-modal.component.html',
  styleUrls: ['./document-widget-template-modal.component.scss'],
})
export class DocumentWidgetTemplateModalComponent {
  /** Type of widget to show. */
  @Input() widgetType:
    | WidgetType.Document
    | WidgetType.DocumentListBanner
    | 'default' = 'default';

  /** Enum widgetType. */
  enumWidgetType = WidgetType;

  /** Data static for each template by widgetType. */
  dataTemplate = {
    ['default']: {
      title: 'Default',
      description: 'Maintain the default document styling.',
    },
    [this.enumWidgetType.DocumentListBanner]: {
      title: 'List with Banner Image',
      description:
        'Display all the values associated with a document along with a custom banner image.',
    },
    [this.enumWidgetType.Document]: {
      title: 'List',
      description: 'Display all the values associated with a document.',
    },
  };
}
