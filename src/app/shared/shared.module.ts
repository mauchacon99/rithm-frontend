import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule
  ],
  exports: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent
  ]
})
export class SharedModule { }
