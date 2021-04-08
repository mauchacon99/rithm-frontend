import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenLoaderComponent } from './full-screen-loader/full-screen-loader.component';



@NgModule({
  declarations: [FullScreenLoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FullScreenLoaderComponent
  ]
})
export class SharedModule { }
