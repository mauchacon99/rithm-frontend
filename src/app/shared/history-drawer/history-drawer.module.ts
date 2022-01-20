import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDrawerComponent } from './history-drawer.component';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';

@NgModule({
  declarations: [HistoryDrawerComponent],
  imports: [CommonModule, UserAvatarModule],
  exports: [HistoryDrawerComponent],
})
export class HistoryDrawerModule {}
