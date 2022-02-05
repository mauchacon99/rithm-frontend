import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationDocumentsModalComponent } from './station-documents-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserAvatarModule } from 'src/app/shared/user-avatar/user-avatar.module';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [StationDocumentsModalComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    UserAvatarModule,
    LoadingIndicatorModule,
    PaginationModule,
    MatDialogModule,
  ],
  exports: [StationDocumentsModalComponent],
})
export class StationDocumentsModalModule {}
