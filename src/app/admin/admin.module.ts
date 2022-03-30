import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationManagementComponent } from './organization-management/organization-management.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from 'src/app/shared/loading-indicator/loading-indicator.module';
import { PaginationModule } from 'src/app/shared/pagination/pagination.module';
import { AdminMenuComponent } from './admin-menu/admin-menu/admin-menu.component';
import { GroupHierarchyComponent } from './action-admin-menu/group-hierarchy/group-hierarchy.component';
import { MatListModule } from '@angular/material/list';
import { GroupListHierarchyComponent } from './action-admin-menu/group-hierarchy/group-list-hierarchy/group-list-hierarchy.component';
import { UserGroupStationAdminComponent } from './action-admin-menu/group-hierarchy/user-group-station-admin/user-group-station-admin.component';
import { ComingSoonMessageModule } from '../shared/coming-soon-message/coming-soon-message.module';
import { ExpansionMemberGroupAdminComponent } from './action-admin-menu/group-hierarchy/expansion-member-group-admin/expansion-member-group-admin.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AdminComponent,
    OrganizationManagementComponent,
    AdminMenuComponent,
    GroupHierarchyComponent,
    GroupListHierarchyComponent,
    UserGroupStationAdminComponent,
    ExpansionMemberGroupAdminComponent,
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
    MatListModule,
    ComingSoonMessageModule,
    MatExpansionModule,
  ],
})
export class AdminModule {}
