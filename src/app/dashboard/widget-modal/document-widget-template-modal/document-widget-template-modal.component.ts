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

  /** Data static for each template by widgetType. */
  dataTemplate = {
    ['default']: {
      image:
        'https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg',
      title: 'Default',
      description: 'Maintain the default document styling..',
    },
    [WidgetType.DocumentListBanner]: {
      image:
        'https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg',
      title: 'List with Banner Image',
      description:
        'Display all the values associated with a document along with a custom banner image.',
    },
    [WidgetType.Document]: {
      image:
        'https://i.pinimg.com/originals/f5/05/24/f50524ee5f161f437400aaf215c9e12f.jpg',
      title: 'List',
      description: 'Display all the values associated with a document.',
    },
  };
}
