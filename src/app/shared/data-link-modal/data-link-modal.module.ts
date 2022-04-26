import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [DataLinkModalModule],
  imports: [CommonModule, MatDialogModule],
  exports: [DataLinkModalModule],
})
export class DataLinkModalModule {}
