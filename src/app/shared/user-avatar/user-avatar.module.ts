import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from './user-avatar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [UserAvatarComponent],
  imports: [CommonModule, MatTooltipModule, MatBadgeModule],
  exports: [UserAvatarComponent],
})
export class UserAvatarModule {}
