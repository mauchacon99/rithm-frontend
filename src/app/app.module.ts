import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { EntryModule } from './entry/entry.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MapModule } from './map/map.module';
import { DocumentModule } from './document/document.module';
import { StationModule } from './station/station.module';
import { SettingsModule } from './settings/settings.module';
import { NavigationModule } from './navigation/navigation.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AdminModule } from './admin/admin.module';
import { InfoDrawerModule } from './info-drawer/info-drawer.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    NavigationModule,
    CoreModule,
    EntryModule,
    InfoDrawerModule,
    DashboardModule,
    MapModule,
    AdminModule,
    DocumentModule,
    StationModule,
    SettingsModule,
    MatSidenavModule // TODO: refactor; AppModule should only bootstrap other app modules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
