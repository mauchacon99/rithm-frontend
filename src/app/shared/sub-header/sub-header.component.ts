import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentStationInformation, StationInformation } from 'src/models';

/**
 * Component for the sub header on document/station views that houses the
 * comments and history.
 */
@Component({
  selector: 'app-sub-header[itemInfo]',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent {
  /** Information about the item displayed on the page with the sub header. */
  @Input() itemInfo!: DocumentStationInformation | StationInformation;

  /** Event to detect click comment outside. */
  @Output() checkClickSubHeader: EventEmitter<boolean> = new EventEmitter();

  /** Current active icon. */
  activeItem = 'none';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private elementRef: ElementRef
  ) {}

  /**
   * The title to be displayed on the sub header.
   *
   * @returns The title for the component.
   */
  get title(): string {
    if (!this.itemInfo) {
      return '';
    }
    return 'documentName' in this.itemInfo ? 'Document' : 'Station';
  }

  /**
   * Toggles the open state detail drawer for comments or history.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'comments' | 'history'): void {
    this.sidenavDrawerService.toggleDrawer(drawerItem, this.itemInfo);
    if (
      (drawerItem === 'history' && this.activeItem === 'none') ||
      (drawerItem === 'comments' && this.activeItem === 'none')
    ) {
      this.activeItem = drawerItem;
    } else {
      this.activeItem = 'none';
    }
  }

  /**
   * Adds a newly posted comment to the list of comments.
   *
   * @param targetElement The comment that was newly added.
   */
  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement: ElementRef): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    this.checkClickSubHeader.emit(clickedInside);
  }
}
