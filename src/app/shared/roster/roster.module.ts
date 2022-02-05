import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterComponent } from './roster.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';
import { RosterManagementModalModule } from '../roster-management-modal/roster-management-modal.module';
import { RosterModalModule } from '../roster-modal/roster-modal.module';

@NgModule({
  declarations: [RosterComponent],
  imports: [
    CommonModule,
    UserAvatarModule,
    LoadingIndicatorModule,
    RosterManagementModalModule,
    RosterModalModule,
  ],
  exports: [RosterComponent],
})
export class RosterModule {}
