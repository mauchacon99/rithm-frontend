import { EnvironmentName } from 'src/models';

export const environment = {
  /** The version number for the app. */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appVersionNumber: `${require('../../package.json').version}`,

  /** The name of the current environment. */
  name: EnvironmentName.Production,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://api.rithm.tech', // TODO: Point to actual URL

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://app.rithm.tech', // TODO: Point to actual URL

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000,
};
