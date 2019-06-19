# Building Integration Tests for Shopify Themes

![Header Image](https://i.imgur.com/Fc0qEdr.jpg)

Welcome! If you just saw the talk at Shopify Unite on setting up integration tests on Shopify, you're in the right place. Below, we're going to help you get set up, and using this repo, see how the various pieces can come together to improve the quality and stability of your Shopify themes.

## Tech Stack

This repo represents a stripped down version of our development pipeline at [Pixelcabin](https://pixelcabin.io). For simplicity, we have removed our normal compilation tasks, to focus on the Cypress component of this project. The integration tests are built around a combination of [Cypress](https://cypress.io) and [Travis CI](https://travis-ci.com), however feel free to look through how this has been structured, and rework for other tools. If you implement a similar setup for another CI provider, please do PR back to this repo, so we can build up a library of solutions across multiple CI environments.

### Installation Steps
Like with all Shopify theme development, you cannot have a local instance of the Shopify platform running on your machine, so all development must be done whilst keeping in sync with a 'theme' on the Shopify store you are developing for. To do this, follow the steps below:

1. Run `npm install -g grunt-cli` and then `npm install` in the root folder of the repo.
1. Duplicate `credentials_template.json`, renaming it just `credentials.json`
1. In your local repo directory, run `grunt zip`, and upload the zip created into `public/theme.zip` to your store.
1. Set up your own Private app (Shopify Admin -> Apps -> Private Apps -> Create App) and name it with your name. The only permissions the credentials need are Write permissions for the *Theme Templates and Theme Assets*.
1. Grab the API key and password from your recently created app, and the theme ID for the theme you uploaded, and add these to the `credentials.json` file you have just created.
1. Set the `url` in `credentials.json` to the full Shopify store url e.g. `"url": "your-store.myshopify.com"` (note: this must be the `.myshopify.com` url, not a custom domain. Do not include the protocol `http://`)

### Using this repo

#### Theme
The `shop` folder holds the standard theme files; to keep any changes in sync, run `grunt watch`. All changes will now be watched for and uploaded to your theme as you modify files.

> ##### Pulling upstream
>
> When you pull upstream to update your own theme, it is recommended to have `grunt watch` running, so that the changes are picked up and synced to your theme.
Sometimes the watcher misses file changes when this happens. If you see problems after pulling in a lot of changes from upstream, it is recommended to trigger a manual sync of the files. With `grunt watch` running, run `grunt exec`.

#### Cypress
All Cypress tests are stored in the `cypress` folder - for more info on getting started with Cypress, check out their [intro guide](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell).

To start up the Cypress interface, run `cypress open`, and then select one or more tests to run.

### Integrating Cypress tests with Travis
This repo has everything set up ready to run Cypress tests on Travis CI. To try this out, first create an account at travis-ci.com, and connect to your Github account or organisation.

For Travis to successfully run the various commands, it will need to have access to some key ENV variables. Some are not sensitive (such as the store url), and can be added to the `.travis.yml` file in the clear. Others will need to be stored securely - these can be added as encrypted values to the `.travis.yml` file, using the [Travis CLI](https://docs.travis-ci.com/user/environment-variables/#encrypting-environment-variables).

1. In `.travis.yml`, set a value under `env.global.shopify_url` to the store you'll be running the tests against
1. Using the Travis CLI, run `travis encrypt SHOPIFY_API_KEY=[your api key] --add`
1. Using the Travis CLI, run `travis encrypt SHOPIFY_API_PASSWORD=[your api password] --add`

You'll also need an ngrok account (you can use the free plan) - once set up, grab your auth token from [https://dashboard.ngrok.com/auth](https://dashboard.ngrok.com/auth), and add to Travis: `travis encrypt NGROK_AUTH_TOKEN=[your ngrok auth token] --add`

-----

## Contributions
Contributions to this project are absolutely welcome. Please feel free to fork this repo, and open a PR for any improvements.
In lieu of a formal styleguide, take care to maintain the existing coding style.

-----

Core maintainers: [@michaelrshannon](https://github.com/michaelrshannon/)

MIT License. Copyright 2019 Pixelcabin. pixelcabin.io

You are not granted rights or licenses to the trademarks of Pixelcabin.
