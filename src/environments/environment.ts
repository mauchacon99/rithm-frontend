// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentName } from 'src/models';

export const environment = {

  /** The version number for the app. */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appVersionNumber: `${require('../../package.json').version}-dev`,

  /** The name of the current environment. */
  name: EnvironmentName.Dev,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://devapi.rithm.tech',

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://devapp.rithm.tech',

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
