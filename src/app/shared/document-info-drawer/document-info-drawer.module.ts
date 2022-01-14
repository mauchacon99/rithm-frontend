import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { DocumentInfoDrawerComponent } from './document-info-drawer.component';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DocumentInfoDrawerComponent],
  imports: [
    CommonModule,
    LoadingIndicatorModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    UserAvatarModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [DocumentInfoDrawerComponent],
})
export class DocumentInfoDrawerModule {}
