import { Component } from '@angular/core';
import { Question } from 'src/models';

/**
 * Component for setting drawer in the station.
 */
@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.scss'],
})
export class SettingDrawerComponent {
  /** The field information for your setting. */
  fieldSetting!: Question;

  constructor() {
    /* */
  }
}
