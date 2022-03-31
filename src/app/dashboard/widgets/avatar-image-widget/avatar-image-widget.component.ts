import { Component, Input } from '@angular/core';

/**
 * Component for Banner avatar image widgets.
 */
@Component({
  selector: 'app-avatar-image-widget[profileImage][isLoading]',
  templateUrl: './avatar-image-widget.component.html',
  styleUrls: ['./avatar-image-widget.component.scss'],
})
export class AvatarImageWidgetComponent {
  /** Image base64 to show profile image. */
  @Input() profileImage!: string;

  /** Is loading get file of avatar. */
  @Input() isLoading = false;
}
