const path = require('path')
const axios = require('axios')
const themeAudit = require(path.resolve('./public/theme.json'))

const checkThemeIsReady = async () => {
  console.log(themeAudit);
  let themeReady= false
  const currentStatus = await axios.get(themeAudit.themeCheckUrl)
  
  if(!currentStatus.data || !currentStatus.data.theme) {
    throw {error: true, message: 'Could not retrieve theme'}
  }

  if(!currentStatus.data.theme.processing && currentStatus.data.theme.previewable) {
    console.log('theme is ready to go, fire up cypress!')
    return true
  }

  console.log('Theme is not ready')
  return setTimeout(checkThemeIsReady, 10000)

}

checkThemeIsReady();