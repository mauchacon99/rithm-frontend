import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CommentComponent],
  imports: [CommonModule, SharedModule],
  exports: [CommentComponent],
})
export class CommentModule {}
