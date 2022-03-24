import { Component, Input } from '@angular/core';

/**
 * Component for Banner avatar image widgets.
 */
@Component({
  selector: 'app-avatar-image-widget',
  templateUrl: './avatar-image-widget.component.html',
  styleUrls: ['./avatar-image-widget.component.scss'],
})
export class AvatarImageWidgetComponent {
  @Input() profileImageId!: string | null;
}
