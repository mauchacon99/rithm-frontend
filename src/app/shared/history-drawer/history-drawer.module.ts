import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDrawerComponent } from './history-drawer.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { UserAvatarModule } from '../user-avatar/user-avatar.module';

@NgModule({
  declarations: [HistoryDrawerComponent],
  imports: [CommonModule, UserAvatarModule, LoadingIndicatorModule],
  exports: [HistoryDrawerComponent],
})
export class HistoryDrawerModule {}
