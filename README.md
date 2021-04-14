# Rithm

[![doc deployments](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml/badge.svg)](https://github.com/strut-software/rithm-front-end/actions/workflows/dev-deployments.yml)

## Getting Started

Clone the repo and perform an `npm i` in the base directory to install all of the dependencies for the project.

Ensure that you are running the latest LTS version of Node.js (v14.15.1 or greater) by running the command `node --version`. The latest version is required for ESLint support.

You can run the web app by using the command `npm start` and opening Google Chrome to the specified localhost address (usually [http://localhost:4200/](http://localhost:4200/)).

## Scripts

`npm start`\
Runs the web app locally on your system.

`npm run build`\
Builds the app to the `/dist` folder without running the project.

`npm run test`\
Serves the test summary page and runs all of the defined tests in the project.

`npm run test-ci`\
Runs all of the defined tests in the project without serving up a webpage.

`npm run lint`\
Checks all of the TypeScript/JavaScript code for lint errors.

`npm run lint-style`\
Checks all of the SCSS/CSS code for lint errors.

`npm run e2e`\
Runs all of the defined end-to-end tests in the project.

`npm run compile-docs`\
Compiles all of the JSDoc and Angular documentation using Compodoc.

`npm run compile-style-docs`\
Compiles all of the styling documentation using SassDoc.

## Documentation

Documentation for front-end code, front-end test coverage, and the back-end API can be found [on our documentation site](https://api.rithm.tech). You will need to sign in with the following credentials:

Username: `docuser` \
Password: `R1thmD0c5`
