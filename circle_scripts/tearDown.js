const path = require('path')
const axios = require('axios')
const themeAudit = require(path.resolve('./public/theme.json'))

const tearDown = async () => {
  if(!themeAudit) {
    throw new Error('public/theme.json required')
  }
  const deleteStatus = await axios.delete(themeAudit.themeCheckUrl)
  
  if(!deleteStatus.data || !deleteStatus.data.id) {
    throw new Error('Theme not deleted') 
  }

  if(currentStatus.data.id) {
    console.log('theme is ready to go, fire up cypress!')
    return {id: themeAudit.id}
  }

}

tearDown()
  .then(data => console.log(`Test theme with id : ${data.id}`))
  .catch(err => {
    console.log(err)
    return process.abort()
  })