require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/Opera')
const Lyric = require('./models/lyric')

const genLyricGraphData = async () => {
  const lyrics = await Lyric.getLyricsById('01001001')
  const roles = ['诸葛亮', '司马懿', '司马师', '司马昭', '赵云', '老军甲', '老军乙']
  const result = []
  const judge = name => {
    for (let i = 0; i < roles.length; i++) {
      if (name === roles[i]) return true
    }
    return false
  }

  for (let i = 0; i < lyrics.rows.length; i++) {
    if (judge(lyrics.rows[i].speakerName)) {
      const item = lyrics.rows[i].lyricContent.length
      result.push(item)
    }
  }
  console.log(result.join('\n'))
}
genLyricGraphData()
