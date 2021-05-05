import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { FormsModule } from '@angular/forms';
import { FullScreenLoaderComponent } from './full-screen-loader/full-screen-loader.component';
import { NotificationCardComponent } from './notification-card/notification-card.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordRequirementsComponent } from './password-requirements/password-requirements.component';
import { NotificationToastsContainerComponent } from './notification-toasts-container/notification-toasts-container.component';


@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent,
    NotificationCardComponent,
    PasswordRequirementsComponent,
    NotificationToastsContainerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatCardContent
  ],
  exports: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent,
    NotificationCardComponent,
    NotificationToastsContainerComponent,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    PasswordRequirementsComponent
  ]
})
export class SharedModule { }
