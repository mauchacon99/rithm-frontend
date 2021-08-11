import { Component} from '@angular/core';
/**
 * Toolbar component.
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  /** Is the inline toolbar open? */
  isInlineToolbarOpen = false;

  /** Tools in the toolbar. */
  tools: any[] = [
    {
      name: 'Short Text',
      icon: 'fas fa-font'
    },
    {
      name: 'Long Text',
      icon: 'fas fa-paragraph'
    },
    {
      name: 'URL',
      icon: 'fas fa-link'
    },
    {
      name: 'Email',
      icon: 'fas fa-envelope'
    },
    {
      name: 'Address',
      icon: 'far fa-address-card'
    },
    {
      name: 'Number',
      icon: 'fas fa-phone'
    },
    {
      name: 'Phone Number',
      icon: 'fas fa-phone'
    },
    {
      name: 'Currency',
      icon: 'fas fa-money-bill-wave'
    },
    {
      name: 'Date',
      icon: 'fas fa-calendar-day'
    },
    {
      name: 'Checkbox',
      icon: 'far fa-check-square'
    },
    {
      name: 'Checklist',
      icon: 'fas fa-list'
    },
    {
      name: 'Single Select',
      icon: 'fas fa-chevron-circle-down'
    },
    {
      name: 'Multi Select',
      icon: 'fas fa-chevron-circle-down'
    }
  ];

  /**
   * Toggle the inline toolbar.
   */
  toggleInlineToolbar(): void {
    this.isInlineToolbarOpen = !this.isInlineToolbarOpen;
  }

  /**
   * Check if toolbar is open before closing it.
   */
  clickedOutside(): void {
    if (this.isInlineToolbarOpen) {
      this.isInlineToolbarOpen = false;
    }
  }

}
