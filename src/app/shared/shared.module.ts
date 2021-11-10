import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
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
import { UserRemovalComponent } from './user-removal/user-removal.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatBadgeModule } from '@angular/material/badge';


@NgModule({
  declarations: [
    PasswordRequirementsComponent,
    RosterComponent,
    PaginationComponent,
    RosterModalComponent,
    StationDocumentsModalComponent,
    UserAvatarComponent,
    UserFormComponent,
    UserRemovalComponent,
    LoadingIndicatorComponent,
    DialogComponent,

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
    MatTooltipModule,
    MatBadgeModule,
  ],
  exports: [
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
    RosterComponent,
    MatDialogModule
  ]
})

export class SharedModule { }
