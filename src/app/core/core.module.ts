import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './token-interceptor.service';
import { CookieService } from 'ngx-cookie-service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule
  ], providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
