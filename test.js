require('./env')
const Opera = require('./models/Opera')

const getAllOperaLyrics = async () => {
  const operas = await Opera.getAllOperas()
  const ids = operas.map(opera => opera.dataValues.operaId)
  console.log(ids)
}
getAllOperaLyrics()
