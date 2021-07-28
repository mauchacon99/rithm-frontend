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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PasswordRequirementsComponent } from './password-requirements/password-requirements.component';
import { RosterComponent } from './roster/roster.component';
import { MatMenuModule } from '@angular/material/menu';
import { PaginationComponent } from './pagination/pagination.component';
import { RosterModalComponent } from './roster-modal/roster-modal.component';
import { StationDocumentsModalComponent } from './station-documents-modal/station-documents-modal.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { UserFormComponent } from './user-form/user-form.component';
import { TermsConditionsModalComponent } from './terms-conditions-modal/terms-conditions-modal.component';
import { UserRemovalComponent } from './user-removal/user-removal.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';


@NgModule({
  declarations: [
    AlertDialogComponent,
    ConfirmDialogComponent,
    PromptDialogComponent,
    PasswordRequirementsComponent,
    RosterComponent,
    PaginationComponent,
    RosterModalComponent,
    StationDocumentsModalComponent,
    UserAvatarComponent,
    UserFormComponent,
    TermsConditionsModalComponent,
    UserRemovalComponent,
    LoadingIndicatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule, // TODO: Remove this? Only required by user removal (test component)
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
    LoadingIndicatorComponent,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    PasswordRequirementsComponent,
    UserAvatarComponent,
    PaginationComponent,
    UserFormComponent,
    UserRemovalComponent,
    RosterComponent
  ]
})
export class SharedModule { }
