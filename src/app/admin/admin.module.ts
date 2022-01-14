import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationManagementComponent } from './organization-management/organization-management.component';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { PaginationModule } from '../shared/pagination/pagination.module';

@NgModule({
  declarations: [AdminComponent, OrganizationManagementComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    PaginationModule
  ],
})
export class AdminModule {}
