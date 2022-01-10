import { EnvironmentName } from 'src/models';

export const environment = {
  /** The version number for the app. */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appVersionNumber: `${require('../../package.json').version}-uat`,

  /** The name of the current environment. */
  name: EnvironmentName.UAT,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://uatapi.rithm.tech',

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://uatapi.rithm.tech',

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000,
};
