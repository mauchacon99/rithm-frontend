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
  ],
  exports: [DocumentInfoDrawerComponent],
})
export class DocumentInfoDrawerModule {}
