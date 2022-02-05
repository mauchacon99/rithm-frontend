import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [CommentComponent],
  imports: [CommonModule, UserAvatarModule],
  exports: [CommentComponent],
})
export class CommentModule {}
