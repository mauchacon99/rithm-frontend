import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent } from './info-drawer/info-drawer.component';
import { StationInfoDrawerComponent } from './station-info-drawer/station-info-drawer.component';
import { DocumentInfoDrawerComponent } from './document-info-drawer/document-info-drawer.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { RosterModule } from '../shared/roster/roster.module';
import { UserAvatarModule } from '../shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [
    InfoDrawerComponent,
    StationInfoDrawerComponent,
    DocumentInfoDrawerComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    LoadingIndicatorModule,
    RosterModule,
    UserAvatarModule
  ],
  exports: [InfoDrawerComponent],
})
export class InfoDrawerModule {}
