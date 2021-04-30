import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { FormsModule } from '@angular/forms';
import { FullScreenLoaderComponent } from './full-screen-loader/full-screen-loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  exports: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent,
    MatProgressSpinnerModule
  ]
})
export class SharedModule { }
