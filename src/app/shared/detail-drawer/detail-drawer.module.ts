import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailDrawerComponent } from './detail-drawer.component';
import { HistoryDrawerModule } from '../history-drawer/history-drawer.module';
import { CommentDrawerModule } from 'src/app/shared/comment/comment-drawer/comment-drawer.module';

@NgModule({
  declarations: [DetailDrawerComponent],
  imports: [CommonModule, HistoryDrawerModule, CommentDrawerModule],
  exports: [DetailDrawerComponent],
})
export class DetailDrawerModule {}
