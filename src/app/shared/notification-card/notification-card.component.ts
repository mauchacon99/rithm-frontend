import { Component } from '@angular/core';

/**
 * Reusable component for notification cards.
 */
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {

  title = 'Steven Rogers tagged you in a comment';

  message = '@Tony Stark please double check the SKU on this new product';

}
