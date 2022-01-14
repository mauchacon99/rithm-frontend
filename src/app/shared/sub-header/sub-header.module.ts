import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeaderComponent } from './sub-header.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SubHeaderComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [SubHeaderComponent],
})
export class SubHeaderModule {}
