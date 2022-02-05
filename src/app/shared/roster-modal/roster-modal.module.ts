import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RosterModalComponent } from './roster-modal.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';
import { LoadingIndicatorModule } from '../loading-indicator/loading-indicator.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [RosterModalComponent],
  imports: [
    CommonModule,
    UserAvatarModule,
    LoadingIndicatorModule,
    MatDialogModule,
  ],
  exports: [RosterModalComponent],
})
export class RosterModalModule {}
