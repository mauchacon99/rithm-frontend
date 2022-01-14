import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentInputComponent } from './comment-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CommentInputComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  exports: [CommentInputComponent],
})
export class CommentInputModule {}
