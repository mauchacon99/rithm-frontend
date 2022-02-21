import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Component for all content inside the drawer for detail (station/document) pages.
 */
@Component({
  selector: 'app-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss'],
})
export class DetailDrawerComponent implements OnDestroy {
  /** Event to detect click comment outside. */
  @Output() checkClickOutsideComment: EventEmitter<boolean> =
    new EventEmitter();

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /**
   * The type of detail item to display in the drawer.
   */
  itemType = '';

  /** The id of the station for which this drawer was opened, or the station in which the document resides. */
  stationId = '';

  /** The id of the document for which this drawer was opened. */
  documentId = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private elementRef: ElementRef
  ) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.itemType = context;
      });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      // TODO: rework typing on this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((context: any) => {
        // TODO: TYLER LOOK INTO THIS JEEZ.
        if (context) {
          this.stationId = context.stationId;
          this.documentId = context.documentRithmId;
        }
      });
  }

  /**
   * Adds a newly posted comment to the list of comments.
   *
   * @param targetElement The comment that was newly added.
   */
  @HostListener('document:click', ['$event.target'])
  onPageClick(targetElement: ElementRef): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    this.checkClickOutsideComment.emit(clickedInside);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
