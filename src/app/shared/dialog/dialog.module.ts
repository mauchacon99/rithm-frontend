import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule],
  exports: [DialogComponent],
})
export class DialogModule {}
