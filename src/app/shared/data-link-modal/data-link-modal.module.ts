import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DataLinkModalModule],
  imports: [CommonModule, MatDialogModule,MatButtonModule],
  exports: [DataLinkModalModule],
})
export class DataLinkModalModule {}
