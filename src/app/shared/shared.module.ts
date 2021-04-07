import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [AlertDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class SharedModule { }
