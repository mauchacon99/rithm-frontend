export const environment = {

  /** Whether the environment is used for testing. */
  testing: false,

  /** Whether the environment is used for production. */
  production: true,

  /** The base URL for the Rithm API. */
  baseApiUrl: 'https://api.rithm.tech', // TODO: Point to actual URL

  /** The base URL for the deployed Rithm app. */
  baseAppUrl: 'https://app.rithm.tech', // TODO: Point to actual URL

  /** The lifetime for which an access token is valid in milliseconds. */
  accessTokenLifetime: 900000
};
