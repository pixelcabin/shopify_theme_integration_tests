const path = require('path')
const axios = require('axios')
const themeAudit = require(path.resolve('./public/theme.json'))

const checkThemeIsReady = async () => {

  const currentStatus = await axios.get(themeAudit.themeCheckUrl)
  
  if(!currentStatus.data || !currentStatus.data.theme) {
    throw new Error('Could not retrieve theme') 
  }

  if(!currentStatus.data.theme.processing && currentStatus.data.theme.previewable) {
    console.log('theme is ready to go, fire up cypress!')
    return true
  }

  console.log('Theme is not ready retrying in ten seconds ...')
  return setTimeout(checkThemeIsReady, 10000)

}

checkThemeIsReady()
  .then(data => data ? console.log('Theme is ready') : "")
  .catch(err => {
    console.log(err)
    return process.abort()
  })