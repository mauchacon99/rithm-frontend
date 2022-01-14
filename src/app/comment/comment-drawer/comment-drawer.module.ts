import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentDrawerComponent } from './comment-drawer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { CommentModule } from '../comment/comment.module';
import { CommentInputModule } from '../comment-input/comment-input.module';

@NgModule({
  declarations: [CommentDrawerComponent],
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule, SharedModule, MatTabsModule, CommentModule, CommentInputModule],
  exports: [CommentDrawerComponent],
})
export class CommentDrawerModule {}
