import { Component, Input } from '@angular/core';
/** Container preview build. */
@Component({
  selector: 'app-container-pre-built-widget[editMode]',
  templateUrl: './container-pre-built-widget.component.html',
  styleUrls: ['./container-pre-built-widget.component.scss'],
})
export class ContainerPreBuiltWidgetComponent {
  /** Edit mode dashboard. */
  @Input() editMode!: boolean;
}
