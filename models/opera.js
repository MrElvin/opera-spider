const db = require('../db')
const OperaDB = db.Opera
const operaModel = '../schema/opera'
const Opera = OperaDB.import(operaModel)

/**
 * 创建一个剧本基本信息
 *
 * @param {*} operaInfo
 */
const createOpera = async function (operaInfo) {
  try {
    const opera = await Opera.create(operaInfo)
    console.log(`${opera.operaId} has been inserted.`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * 获取所有的剧本列表
 *
 * @returns
 */
const getAllOperas = async function () {
  const operas = await Opera.findAll()
  return operas
}

/**
 * 根据剧本 id，获取剧本
 *
 * @param {*} id
 * @returns
 */
const getOperaById = async function (id) {
  const operaInfo = await Opera.findOne({
    where: {
      operaId: id
    }
  })
  return operaInfo
}

module.exports = {
  createOpera,
  getAllOperas,
  getOperaById
}
