import { Component } from '@angular/core';

/**
 * Component for station private fields extension panel.
 */
@Component({
  selector: 'app-private-fields',
  templateUrl: './private-fields.component.html',
  styleUrls: ['./private-fields.component.scss']
})
export class PrivateFieldsComponent {

  /**
   * Provisional for Repeat data cards field private.
   *
   * @returns Fields private for Cards provisional.
   */
  get fieldsPrivatesProvisional(): Array<[]> {
    return Array(5);
  }
}
