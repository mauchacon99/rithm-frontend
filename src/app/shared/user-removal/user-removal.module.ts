import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRemovalComponent } from './user-removal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserRemovalComponent],
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule],
  exports: [UserRemovalComponent],
})
export class UserRemovalModule {}
