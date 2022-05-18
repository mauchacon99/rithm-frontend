import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';

/**
 * Component for show error.
 */
@Component({
  selector: 'app-error-widget[errorMessage][permission]',
  templateUrl: './error-widget.component.html',
  styleUrls: ['./error-widget.component.scss'],
})
export class ErrorWidgetComponent implements OnInit, OnDestroy {
  /** Show message error. */
  @Input() errorMessage!: string;

  /** Validate if user have permissions. */
  @Input() permission = false;

  /** Show message for delete widget. */
  @Input() widgetDeleted = false;

  /** Dashboard permission for current user. */
  @Input() dashboardPermission = false;

  /** Output try again. */
  @Output() tryAgain = new EventEmitter();

  /** Output open drawer for delete widget. */
  @Output() deleteWidget = new EventEmitter();

  /** Context of drawer opened. */
  drawerContext!: string;

  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  constructor(private sidenavDrawerService: SidenavDrawerService) {}

  /** Init method. */
  ngOnInit(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((drawerContext) => {
        this.drawerContext = drawerContext;
      });
  }

  /**
   * Try again.
   */
  reloadRequest(): void {
    this.tryAgain.emit();
  }

  /**
   * Delete widget.
   */
  removeWidget(): void {
    this.deleteWidget.emit();
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
