import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from './top-nav/top-nav.component';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationMenuContainerComponent } from './notification-menu-container/notification-menu-container.component';
import { RouterModule } from '@angular/router';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { NotificationToastsContainerComponent } from './notification-toasts-container/notification-toasts-container.component';
import { MatCardModule } from '@angular/material/card';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TopNavComponent,
    NotificationMenuContainerComponent,
    NotificationCardComponent,
    NotificationToastsContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    ClickOutsideModule,
    SharedModule,
  ],
  exports: [
    TopNavComponent,
    NotificationMenuContainerComponent,
    NotificationCardComponent,
    NotificationToastsContainerComponent,
  ],
})
export class NavigationModule {}
