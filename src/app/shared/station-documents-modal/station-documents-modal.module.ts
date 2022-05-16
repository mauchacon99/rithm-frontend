import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [StationDocumentsModalComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    UserAvatarModule,
    LoadingIndicatorModule,
    PaginationModule,
    MatDialogModule,
    MatInputModule,
    MatSortModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    MatRippleModule,
  ],
  exports: [StationDocumentsModalComponent],
})
export class StationDocumentsModalModule {}
