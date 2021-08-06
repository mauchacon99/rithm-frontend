export const environment = {

  /** The version number for the app. */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  appVersionNumber: `${require('../../package.json').version}-test`,

  /** Whether the environment is used for testing. */
  testing: true,

  /** Whether the environment is used for production. */
  production: false,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://testapi.rithm.tech',

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://testapp.rithm.tech',

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000
};
