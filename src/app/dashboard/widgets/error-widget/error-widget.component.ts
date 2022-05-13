import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for show error.
 */
@Component({
  selector: 'app-error-widget[errorMessage][permission]',
  templateUrl: './error-widget.component.html',
  styleUrls: ['./error-widget.component.scss'],
})
export class ErrorWidgetComponent implements OnInit {
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

  /** Output try again. */
  @Output() deleteWidget = new EventEmitter();

  /** Validate if the current user is admin. */
  isAdmin = false;

  /**
   * Whether the drawer is open.
   *
   * @returns True if the drawer is open, false otherwise.
   */
  get isDrawerOpen(): boolean {
    return this.sidenavDrawerService.isDrawerOpen;
  }

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService
  ) {}

  /** Init method. */
  ngOnInit(): void {
    this.isAdmin = this.userService.isAdmin;
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
}
