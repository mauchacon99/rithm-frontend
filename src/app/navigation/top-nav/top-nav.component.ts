import { Component, HostListener, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { SidenavService } from 'src/app/core/sidenav.service';
import { UserService } from 'src/app/core/user.service';

/**
 * Component for the top site navigation.
 */
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent {
  /** Trigger for user menu. */
  @ViewChild(MatMenuTrigger)
  private userMenuTrigger!: MatMenuTrigger;

  /** List of navigation items. */
  navItems = ['dashboard', 'map'];

  /** Monogram for user profile icon. */
  monogram = 'AB';

  /** Init the browser width. */
  innerWidth = 0;

  /** Use to toggle visibility of notifications. */
  notificationsVisible = false;

  constructor(
    private sidenavService: SidenavService,
    private userService: UserService
  ) {}

  /**
   * Toggle opening and closing of the mobile navigation.
   */
  toggle(): void {
    this.sidenavService.toggle();
  }

  /**
   * Check if screen size changes to hide mobile nav.
   * Close user menu if screen size changes.
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth >= 768) {
      this.sidenavService.close();
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
