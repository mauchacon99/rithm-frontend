# Rithm

[Enlace a la versión en español](README_ES.md)

[![Dev Deployments](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml/badge.svg)](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml)

[![Test Deployments](https://github.com/strut-software/rithm-front-end/actions/workflows/test-deployments.yml/badge.svg)](https://github.com/strut-software/rithm-front-end/actions/workflows/test-deployments.yml)

## Getting Started

Clone the repo and perform an `npm i` in the base directory to install all of the dependencies for the project.

Ensure that you are running the latest current LTS version of Node.js (v16.13.1 or greater) by running the command `node --version`. The latest version is required for ESLint support.

You can run the web app by using the command `npm start` and opening Google Chrome to the specified localhost address (usually [https://localhost:4200/](https://localhost:4200/)).

NOTE: You may see a message that says:

> Your connection is not private

This is because we use a self-signed certificate to use HTTPS locally during development, so you shouldn't worry about this. If you select `Advanced` or `Show Details`, you should be able to proceed to the page, which should make this certificate trusted on your system.

## Testing Changes on Mobile

If you want to test your locally served changes on a mobile device or tablet, you can instead run the app with the `--host {{ your local IP address }}`. So this would something like `ng serve --host 192.168.x.x` or `npm start -- --host 192.168.x.x`. You can find some simple instructions on locating this IP address for Windows and Mac [here](https://www.ipconfig.in/what-is-my-local-ip-address/).

Once the development server is running, you can open the link listed in the terminal on your external device. You will need to make sure that the development server machine and the external device are on the same local network. The link will look something like `https://192.168.x.x:4200`. You will likely have to trust the certificate for the page for the same reasons mentioned above under **Getting Started**.

> NOTE: The site will be accessible for anybody on your network, so be careful which networks you expose this to. Likely this won't be a concern, however.

### Sign In

You can use any of the following pre-existing credentials for signing in:

| Email                       | Password    | Note                      |
| --------------------------- | ----------- | ------------------------- |
| workeruser@inpivota.com     | R1thm?24601 |
| rithmuser@inpivota.com      | R1thm?24601 |
| supervisoruser@inpivota.com | R1thm?24601 |
| harrypotter@inpivota.com    | R1thm?24601 |
| rithmadmin@inpivota.com     | R1thm?24601 | User has admin privileges |
| marypoppins@inpivota.com    | R1thm?24601 | User has no stations      |

## Documentation

Documentation for front-end code, front-end test coverage, and the back-end API can be found [on our documentation site](https://devapi.rithm.tech). You will need to sign in with the following credentials:

Username: `docuser` \
Password: `R1thmD0c5`

## Deployments

You can find the deployed web app at the following locations. Each is using a different environment, so use the one best suited for your needs.

[Development](https://devapp.rithm.tech) \
[Testing](https://testapp.rithm.tech)

Username: `docuser` \
Password: `R1thmD0c5`

## Scripts

`npm start`\
Runs the web app locally on your system.

`npm run build`\
Builds the app to the `/dist` folder without running the project using the dev environment.

`npm run build-test`\
Builds the app to the `/dist` folder without running the project using the test environment.

`npm run test`\
Serves the test summary page and runs all of the defined tests in the project.

`npm run test-ci`\
Runs all of the defined tests in the project without serving up a webpage.

`npm run format`\
Formats all of the files in the project using Prettier.

`npm run format-check`\
Checks that all of the files in the project have been formatted using Prettier.

`npm run lint`\
Checks all of the TypeScript/JavaScript code for lint errors.

`npm run lint-style`\
Checks all of the SCSS/CSS code for lint errors.

`npm run compile-docs`\
Compiles all of the JSDoc and Angular documentation using Compodoc.

`npm run compile-style-docs`\
Compiles all of the styling documentation using SassDoc.

`npm run a11y`\
Checks the project for accessibility issues.
