import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { DialogModule } from '../shared/dialog/dialog.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, MatDialogModule, MatSnackBarModule, DialogModule],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
