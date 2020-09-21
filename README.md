# Vendr End-to-End Tests
A suite of End-to-End Tests for Vendr, the eCommerce solution for Umbraco v8+, using the [Cypress.io](https://cypress.io) test runner.

## Prerequisites
- NodeJS 12+
- A fully configured install of Umbraco + Vendr in a `/sandbox/` folder.
  - Install using a SqlServer/LocalDb as the tests execute too fast for SqlCE to handle.
- User information in cypress.env.json (See [Getting started](#getting-started))

## Getting started
Fork and clone locally then run `npm install` to install all developer dependencies.

Next, it is important that you create a new file in the root of the project called `cypress.env.json`. This file is already added to `.gitignore` and can contain values that are different for each developer machine.

The file needs the following content:

    {
        "username": "<email for superadmin>",
        "password": "<password for superadmin>"
    }

Replace the `<email for superadmin>` and `<password for superadmin>` placeholders with correct info.
  
## Executing tests
There are two npm scripts that can be used to execute the test:

- npm run test
  Executes the tests headless.
- npm run ui
  Executes the tests in a browser handled by a cypress application.
  
In case of errors it is recommended to use the UI to debug.
