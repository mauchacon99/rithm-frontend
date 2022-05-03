import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  DocumentStationInformation,
  StationInfoDrawerData,
  StationInformation,
} from 'src/models';

/**
 * Component for the sub header on document/station views that houses the
 * comments and history.
 */
@Component({
  selector: 'app-sub-header[itemInfo][newInterfaceView]',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent {
  /** Information about the item displayed on the page with the sub header. */
  @Input() itemInfo!: DocumentStationInformation | StationInformation;

  /** Event to detect click comment outside. */
  @Output() checkClickSubHeader: EventEmitter<boolean> = new EventEmitter();

  /** Is component viewed in station edit mode? */
  @Input() stationEditMode = false;

  /** Is displayed in a new interface? */
  @Input() newInterfaceView = false;

  /** Whether the subheader is rendered in stationSection or containerSection. */
  @Input() isStation = false;

  /** The selected tab index/init. */
  @Output() headerSelectedTab = new EventEmitter<number>();

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
   * Get name of station from StationInformation based on type.
   *
   * @returns The Station Name.
   */
  get stationName(): string {
    if (!this.itemInfo) {
      return '';
    }
    return 'stationName' in this.itemInfo
      ? this.itemInfo.stationName
      : this.itemInfo.name;
  }

  /**
   * The id of the station or document.
   *
   * @returns The id of the station or document.
   */
  get stationRithmId(): string {
    if (!this.itemInfo) {
      return '';
    }
    return 'rithmId' in this.itemInfo
      ? this.itemInfo.rithmId
      : this.itemInfo.stationRithmId;
  }

  /**
   * Toggles the open state detail drawer for comments or history.
   *
   * @param drawerItem The drawer item to toggle.
   */
  toggleDrawer(drawerItem: 'comments' | 'history' | 'stationInfo'): void {
    if (
      (drawerItem === 'history' && this.activeItem === 'none') ||
      (drawerItem === 'comments' && this.activeItem === 'none') ||
      (drawerItem === 'stationInfo' && this.activeItem === 'none')
    ) {
      this.activeItem = drawerItem;
    } else {
      this.activeItem = 'none';
    }
    if (drawerItem === 'stationInfo') {
      const dataInformationDrawer: StationInfoDrawerData = {
        stationRithmId: this.stationRithmId,
        stationName: this.stationName,
        editMode: this.stationEditMode,
        openedFromMap: false,
      };
      this.sidenavDrawerService.toggleDrawer(drawerItem, dataInformationDrawer);
    } else {
      this.sidenavDrawerService.toggleDrawer(drawerItem, this.itemInfo);
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

  /**
   * Detect tabs changed.
   *
   * @param tabChangeEvent Receives the detail from tab selected.
   */
  tabSelectedChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.headerSelectedTab.emit(tabChangeEvent.index);
  }
}
