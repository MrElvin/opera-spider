require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/opera')

/**
 * 获取所有京剧剧本的情节信息和注释信息
 *
 */
const getOperaBriefs = async () => {
  const operas = await Opera.getAllOperas()
  const ids = operas.map(opera => opera.dataValues.operaId)
  try {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const html = await rp.get(OPERA.OPERA_DETAIL_URL + id)
      const $ = cheerio.load(html)
      $('#article h1').remove()
      $('#article .photoHolder').remove()
      const articleTextArr = $('#article').text().split('\n')
      let briefIndex = 0
      let commentIndex = 0
      for (let j = 0; j < articleTextArr.length; j++) {
        if (/^情节/.test(articleTextArr[j])) {
          briefIndex = j
        }
        if (/^注释/.test(articleTextArr[j])) {
          commentIndex = j
        }
      }
      const opera = await Opera.getOperaById(id)
      opera.operaBrief = briefIndex ? articleTextArr[briefIndex].substring(2) : ''
      opera.operaComment = commentIndex ? articleTextArr[commentIndex].substring(2) : ''
      await opera.save()
    }
  } catch (err) {
    console.error(err)
  }
}
getOperaBriefs()
