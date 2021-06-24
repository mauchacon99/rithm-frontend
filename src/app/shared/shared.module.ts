import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertDialogComponent } from './dialogs/alert-dialog/alert-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from './dialogs/prompt-dialog/prompt-dialog.component';
import { FormsModule } from '@angular/forms';
import { FullScreenLoaderComponent } from './full-screen-loader/full-screen-loader.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordRequirementsComponent } from './password-requirements/password-requirements.component';
import { RosterComponent } from './roster/roster.component';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from './pagination/pagination.component';
import { RosterModalComponent } from './roster-modal/roster-modal.component';
import { StationDocumentsModalComponent } from './station-documents-modal/station-documents-modal.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';


@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent,
    PasswordRequirementsComponent,
    RosterComponent,
    PaginationComponent,
    RosterModalComponent,
    StationDocumentsModalComponent,
    UserAvatarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule
  ],
  exports: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    FullScreenLoaderComponent,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    PasswordRequirementsComponent,
    UserAvatarComponent,
    PaginationComponent
  ]
})
export class SharedModule { }
