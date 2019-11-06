const db = require('../db')
const OperaDB = db.Opera
const roleModel = '../schema/role'
const Role = OperaDB.import(roleModel)

/**
 * 创建一个角色
 *
 * @param {*} roleInfo
 */
const createRole = async function (roleInfo) {
  try {
    const role = await Role.create(roleInfo)
    console.log(`${role.roleName} - ${role.operaRoleName} has been inserted.`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * 根据角色名和角色行当搜索该角色
 *
 * @param {*} searchInfo
 * @returns
 */
const getRoleByNames = async function (searchInfo) {
  const role = await Role.findOne({
    where: {
      roleName: searchInfo.roleName,
      operaRoleName: searchInfo.operaRoleName
    }
  })
  return role
}

module.exports = {
  createRole,
  getRoleByNames
}
