import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
  /** Tabs parents custom and pre build. */
  tabsParents = ['Custom', 'Pre Built'];

  /** Tab Parents selected. */
  tabParentSelect = new FormControl(0);
}
