import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataLinkFieldComponent } from './data-link-field.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoadingIndicatorModule } from '../../loading-indicator/loading-indicator.module';
@NgModule({
  declarations: [DataLinkFieldComponent],
  imports: [
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    LoadingIndicatorModule,
  ],
  exports: [DataLinkFieldComponent],
})
export class DataLinkFieldModule {}
