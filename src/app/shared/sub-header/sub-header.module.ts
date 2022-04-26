import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeaderComponent } from './sub-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [SubHeaderComponent],
  imports: [CommonModule, MatButtonModule, MatTabsModule],
  exports: [SubHeaderComponent],
})
export class SubHeaderModule {}
