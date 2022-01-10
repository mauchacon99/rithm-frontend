import { EnvironmentName } from 'src/models';

export const environment = {
  /** The version number for the app. */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appVersionNumber: `${require('../../package.json').version}-test`,

  /** The name of the current environment. */
  name: EnvironmentName.Test,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://testapi.rithm.tech',

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://testapp.rithm.tech',

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000,
};
