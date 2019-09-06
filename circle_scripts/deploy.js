const express = require('express')
const app = express()
const ngrok = require('ngrok')
const fs = require('fs')
const path = require('path')
const args = require('yargs').argv
const axios = require('axios')

// start a basic server to serve the public folder
app.use(express.static(path.resolve('./public')))
const server = app.listen(3000);

/**
 * A really rough and ready deploy script
 * Excuse the verbosity 
 */
const serverAndDeploy = async () => {
  
  // serve public

  const {
    SHOPIFY_API_KEY,
    SHOPIFY_API_PASSWORD, 
    SHOPIFY_URL, 
    BUILD_NUMBER, 
    NGROK_TOKEN,
    CYPRESS_PROJECT_ID
  } = args

  if(!SHOPIFY_API_KEY || !SHOPIFY_API_PASSWORD || !SHOPIFY_URL || !NGROK_TOKEN) {
    console.log("Please set environment variables in circleci all of the following are required. SHOPIFY_API_KEY && SHOPIFY_API_PASSWORD && SHOPIFY_URL && NGROK_TOKEN")
    throw new Error('Vars missing all of the following are required: SHOPIFY_API_KEY, SHOPIFY_API_PASSWORD, SHOPIFY_URL, NGROK_TOKEN. You can set these in circle envirment varianbles for the project.')
  }

  // ngrok to port 3000 which is serving the public folder
  const url = await ngrok.connect({
    proto: 'http',
    port: 3000,
    authToken: NGROK_TOKEN,
  })

  // this will be printed in the termininal
  console.log('Serving public folder at:', url)
  
  const installUrl = `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_URL}/admin/api/2019-07/themes.json`
  
  // deploy the theme 
  const themeObject = {
      "theme": {
        "name": `circleci + cypress build: ${BUILD_NUMBER}`,
        "src": `${url}/theme.zip`,
        "role": "unpublished"
    }
  }
  return axios.post(installUrl, themeObject)
    .then(response => {

      if(!response.data || !response.data.theme || !response.data.theme.id) { 
        console.log('error deploying theme')
        server.close()
        ngrok.kill()
        throw new Error ({status: 500, message: 'no theme created'})
      }

      const themeId = response.data.theme.id
      // Ok we have data, lets write it so we can reference if
      const previewUrl = `https://${SHOPIFY_URL}?preview_theme_id=${themeId}`
      const themeCheckUrl = `https://${SHOPIFY_API_KEY}:${SHOPIFY_API_PASSWORD}@${SHOPIFY_URL}/admin/api/2019-07/themes/${themeId}.json`
      const themeAudit = Object.assign({}, response.data.theme, {themePreviewUrl: previewUrl, themeCheckUrl: themeCheckUrl})
      // kill ngrok & Server
      server.close()
      ngrok.kill()

      // write an audit file I would normally write this to the actual themes
      fs.writeFileSync(`${path.resolve('./public')}/theme.json`, JSON.stringify(themeAudit))
      console.log('Theme created cuccessfully & audit file written', response.data.theme)

      // write Cypress json so we can dynamically pick this up at any point
      fs.writeFileSync(`${path.resolve('./')}cypress.json`, `{"baseUrl": ${previewUrl}, "projectId": "${CYPRESS_PROJECT_ID ? CYPRESS_PROJECT_ID : ''}"}`)
      console.log('./cypress.json updated with preview url')
      // all good 
      return {success: true, message: `Theme Created successfully with the id: ${themeId}`}
    })
    .catch(err => {
      // Deploy error
      console.log('error deploying theme', err.message)
      server.close()
      ngrok.kill()
      throw err
    })

  // Deploy
  // Write Public so it can be saved and retrieved
}

serverAndDeploy();