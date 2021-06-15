import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { EntryModule } from './entry/entry.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DocumentModule } from './document/document.module';
import { StationModule } from './station/station.module';
import { SettingsModule } from './settings/settings.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    DashboardModule,
    EntryModule,
    MapModule,
    DocumentModule,
    StationModule,
    SettingsModule,
    SharedModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
