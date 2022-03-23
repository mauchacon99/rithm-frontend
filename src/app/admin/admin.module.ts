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
import { AdminMenuComponent } from './admin-menu/admin-menu/admin-menu.component';
import { GroupHierarchyComponent } from './action-admin-menu/group-hierarchy/group-hierarchy.component';
import { GroupListHierarchyComponent } from './action-admin-menu/group-hierarchy/group-list-hierarchy/group-list-hierarchy.component';

@NgModule({
  declarations: [
    AdminComponent,
    OrganizationManagementComponent,
    AdminMenuComponent,
    GroupHierarchyComponent,
    GroupListHierarchyComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    LoadingIndicatorModule,
    PaginationModule,
  ],
})
export class AdminModule {}
