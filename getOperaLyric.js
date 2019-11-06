require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/Opera')
const Lyric = require('./models/lyric')

/**
 * 获取所有的戏词信息：唱词人、唱词内容、唱法
 *
 */
const getAllOperaLyrics = async () => {
  try {
    const operas = await Opera.getAllOperas()
    const ids = operas.map(opera => opera.dataValues.operaId)
    // let index = 0
    // for (let i = 0; i < ids.length; i++) {
    //   if (ids[i] === '03054005') index = i
    // }
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const html = await rp.get(OPERA.OPERA_DETAIL_URL + id)
      const $ = cheerio.load(html)
      $('#article h1').remove()
      $('#article .photoHolder').remove()
      const lyrics = $('#article p')
      let lyricIndex = 0
      let lastLyricSpeaker = ''
      for (let j = 0; j < lyrics.length; j++) {
        const lyric = $(lyrics[j]).text()
        const lyricArray = lyric.split(/\s+/)
        const lyricInfo = {
          operaId: id,
          speakerCount: 1,
          lyricIndex
        }
        if (lyricArray.length === 3) { // 人物 + 唱法 + 台词
          if (lyricArray[0]) {
            lyricInfo.speakerName = lyricArray[0]
            lastLyricSpeaker = lyricInfo.speakerName
            // String.fromCharCode(65288) -> （
            // String.fromCharCode(65289) ->  ）
            lyricInfo.speakType = lyricArray[1].replace(String.fromCharCode(65288), '').replace(String.fromCharCode(65289), '')
            lyricInfo.lyricContent = lyricArray[2]
            await Lyric.createLyric(lyricInfo)
          } else {
            lyricInfo.speakerName = lastLyricSpeaker
            lyricInfo.speakType = lyricArray[1].replace(String.fromCharCode(65288), '').replace(String.fromCharCode(65289), '')
            lyricInfo.lyricContent = lyricArray[2]
            await Lyric.createLyric(lyricInfo)
          }
          lyricIndex++
        } else if (lyricArray.length === 2) { // 台词
          if (lyricArray[0]) {
            lyricInfo.speakerName = lyricArray[0]
            lastLyricSpeaker = lyricInfo.speakerName
            const tempArray = lyricArray[1].split(String.fromCharCode(65289))
            lyricInfo.speakType = tempArray[0].replace(String.fromCharCode(65288), '')
            lyricInfo.lyricContent = tempArray[1]
            await Lyric.createLyric(lyricInfo)
            lyricIndex++
          } else {
            if (lyricArray[1][0] === String.fromCharCode(65288)) {
              const tempArray = lyricArray[1].split(String.fromCharCode(65289))
              lyricInfo.speakerName = lastLyricSpeaker
              lyricInfo.speakType = tempArray[0].replace(String.fromCharCode(65288), '')
              lyricInfo.lyricContent = tempArray[1]
              lyricIndex++
              await Lyric.createLyric(lyricInfo)
            } else {
              const lyric = await Lyric.getLyricByInfo({
                operaId: id,
                speakerName: lastLyricSpeaker,
                lyricIndex: lyricIndex - 1
              })
              lyric.lyricContent += lyricArray[1]
              await lyric.save()
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}

getAllOperaLyrics()
