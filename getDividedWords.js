require('./env')
const Opera = require('./models/opera')
const Lyric = require('./models/lyric')
const fs = require('fs')
const nodejieba = require('nodejieba')

const wordsResult = {}
const topN = 10
const getDividedWords = async () => {
  const allOperas = (await Opera.getAllOperas()).sort()
  const allTagTrainOperas = allOperas.slice(0, 200)
  const operaCategory = {
    love: [],
    live: [],
    politics: [],
    military: [],
    myth: [],
    hero: []
  }
  for (let i = 0; i < allTagTrainOperas.length; i++) {
    const tempOpera = allTagTrainOperas[i]
    switch (tempOpera.operaTopic) {
      case '儿女缠绵':
        operaCategory.love.push(tempOpera)
        break
      case '世俗生活':
        operaCategory.live.push(tempOpera)
        break
      case '政治斗争':
        operaCategory.politics.push(tempOpera)
        break
      case '军事风云':
        operaCategory.military.push(tempOpera)
        break
      case '神话传说':
        operaCategory.myth.push(tempOpera)
        break
      case '草莽英雄':
        operaCategory.hero.push(tempOpera)
        break
    }
  }
  const stringCategory = {
    love: [],
    live: [],
    politics: [],
    military: [],
    myth: [],
    hero: []
  }
  const categories = Object.keys(operaCategory)
  for (const categoryName of categories) {
    const theCategoryOperas = operaCategory[categoryName]
    for (let i = 0; i < theCategoryOperas.length; i++) {
      const lyrics = await Lyric.getLyricsById(theCategoryOperas[0].operaId)
      stringCategory[categoryName] = stringCategory[categoryName] + lyrics.rows.map(v => v.lyricContent).join('\n') + '\n'
    }
  }
  for (const categoryName of categories) {
    const sentence = stringCategory[categoryName]
    const result = nodejieba.tag(sentence)
    wordsResult[categoryName] = nodejieba.extractWithWords(nodejieba.tagWordsToStr(result), topN)
  }
  // console.log(wordsResult)
  // console.log(stringCategory.hero)
  // fs.writeFileSync('love.txt', stringCategory.love)
  // fs.writeFileSync('live.txt', stringCategory.live)
  // fs.writeFileSync('politics.txt', stringCategory.politics)
  // fs.writeFileSync('military.txt', stringCategory.military)
  // fs.writeFileSync('myth.txt', stringCategory.myth)
  // fs.writeFileSync('hero.txt', stringCategory.hero)
}
getDividedWords()
