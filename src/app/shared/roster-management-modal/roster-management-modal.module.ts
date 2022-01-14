import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterManagementModalComponent } from './roster-management-modal.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';
import { PaginationModule } from '../pagination/pagination.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [RosterManagementModalComponent],
  imports: [
    CommonModule,
    UserAvatarModule,
    LoadingIndicatorModule,
    PaginationModule,
    MatDialogModule,
  ],
  exports: [RosterManagementModalComponent],
})
export class RosterManagementModalModule {}
