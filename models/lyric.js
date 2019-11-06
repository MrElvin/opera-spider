const db = require('../db')
const OperaDB = db.Opera
const lyricModel = '../schema/lyric'
const Lyric = OperaDB.import(lyricModel)

/**
 * 创建一个戏词
 *
 * @param {*} lyricInfo
 */
const createLyric = async function (lyricInfo) {
  try {
    const lyric = await Lyric.create(lyricInfo)
    console.log(`${lyric.operaId} - ${lyric.speakerName} - ${lyric.lyricIndex} has been inserted.`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * 根据搜索内容（operaId，speakerName，lyricIndex）获取戏词
 *
 * @param {*} searchInfo
 * @returns
 */
const getLyricByInfo = async function (searchInfo) {
  try {
    const lyric = await Lyric.findOne({
      where: {
        operaId: searchInfo.operaId,
        speakerName: searchInfo.speakerName,
        lyricIndex: searchInfo.lyricIndex
      }
    })
    return lyric
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  createLyric,
  getLyricByInfo
}
