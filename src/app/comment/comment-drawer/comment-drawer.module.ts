import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentDrawerComponent } from './comment-drawer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentModule } from '../comment/comment.module';
import { CommentInputModule } from '../comment-input/comment-input.module';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';

@NgModule({
  declarations: [CommentDrawerComponent],
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule, MatTabsModule, CommentModule, CommentInputModule, LoadingIndicatorModule],
  exports: [CommentDrawerComponent],
})
export class CommentDrawerModule {}
