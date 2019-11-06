require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/Opera')
const Role = require('./models/Role')

/**
 * 获取京剧剧本内的所有角色名、行当等信息
 *
 */
const getAllOperaRoles = async () => {
  try {
    const operas = await Opera.getAllOperas()
    const ids = operas.map(opera => opera.dataValues.operaId)
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      const html = await rp.get(OPERA.OPERA_DETAIL_URL + id)
      const $ = cheerio.load(html)
      $('#article h1').remove()
      $('#article .photoHolder').remove()
      const articleTextArr = $('#article').text().split('\n')
      let count = 0
      for (let j = 0; j < articleTextArr.length; j++) {
        const item = articleTextArr[j]
        if (/：/.test(item)) {
          count++
        } else {
          break
        }
      }
      for (let j = 0; j < count; j++) {
        let [roleName, operaRoleName] = articleTextArr[j].split('：')
        if (j === 0) {
          roleName = roleName.substring(4)
        }
        const role = await Role.getRoleByNames({ roleName, operaRoleName })
        if (!role) {
          await Role.createRole({
            roleName,
            operaRoleName,
            operaId: id
          })
        } else {
          const prevOperaId = role.operaId
          role.operaId = `${prevOperaId},${id}`
          await role.save()
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
}

getAllOperaRoles()
