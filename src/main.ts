import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EnvironmentName } from './models';

if (environment.name === EnvironmentName.Production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);
