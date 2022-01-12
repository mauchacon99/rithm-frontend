import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountSettingsService } from 'src/app/core/account-settings.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { User } from 'src/models';

/**
 * Component for the top site navigation.
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  /** Trigger for user dashboard-menu. */
  @ViewChild(MatMenuTrigger)
  private userMenuTrigger!: MatMenuTrigger;

  /** List of navigation items. */
  navItems = ['dashboard', 'map'];

  /** User variable. */
  user: User;

  /** Init the browser width. */
  innerWidth = 0;

  /** Use to toggle visibility of notifications. */
  notificationsVisible = false;

  /** The subject data for updated user first name and last name. */
  sub$ = new Subject();

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private accountSettingsService: AccountSettingsService
  ) {
    // Setup...
    this.user = this.userService.user as User;
  }

  /**
   * Sets updated user first name and last name in account settings component.
   *
   */
  ngOnInit(): void {
    this.accountSettingsService.currentUser$
      .pipe(takeUntil(this.sub$))
      .subscribe((user) => {
        if (user && user.firstName && user.lastName) {
          this.user.firstName = user?.firstName;
          this.user.lastName = user?.lastName;
        }
      });

    if (this.user.role === 'admin') {
      this.navItems.push('admin');
    }
  }

  /**
   * Toggle opening and closing of the mobile navigation.
   */
  toggle(): void {
    this.sidenavDrawerService.toggleSidenav();
  }

  /**
   * Check if screen size changes to hide mobile nav.
   * Close user dashboard-menu if screen size changes.
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth >= 768) {
      this.sidenavDrawerService.closeSidenav();
    }
    if (this.innerWidth <= 768) {
      this.userMenuTrigger.closeMenu();
    }
  }

  /**
   * Toggle opening and closing of notifications.
   */
  toggleNotifications(): void {
    this.notificationsVisible = !this.notificationsVisible;
  }

  /**
   * Check if notifications are open before closing them.
   */
  clickedOutside(): void {
    if (this.notificationsVisible) {
      this.notificationsVisible = false;
    }
  }

  /**
   * Signs the user out of the app.
   */
  signOut(): void {
    this.userService.signOut();
  }
}
