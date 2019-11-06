require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/opera')

/**
 * 根据传入的朝代，来返回该朝代下的京剧名称列表
 * 返回值为 promise
 *
 * @param {*} period
 * @returns
 */
const getAllOperaNameByPeriod = period => {
  return rp.get(OPERA.OPERA_PERIOD_LIST_URL + encodeURIComponent(period))
    .then(res => {
      const $ = cheerio.load(res)
      const operaNames = []
      const list = $('.bullet')
      for (let i = 0; i < list.length; i++) {
        operaNames.push({
          name: $(list[i]).text(),
          period: period,
          searchName: $(list[i]).find('b').text().split(String.fromCharCode(12304))[0] // String.fromCharCode(12304) -> 【
        })
      }
      return operaNames
    })
}

/**
 * 遍历朝代列表，返回所有的朝代下的京剧列表
 * 返回值为 promise
 *
 * @returns
 */
const getAllOperaNameByPeriods = periods => {
  const promises = periods.map(period => getAllOperaNameByPeriod(period))
  return Promise.all(promises)
    .then(res => res.reduce((total, curr) => {
      total = [...total, ...curr]
      return total
    }, []))
}

/**
 * 获取搜索到的京剧标题和 id
 *
 * @param {*} opera
 * @returns
 */
const getSearchedList = opera => {
  return rp.get(OPERA.OPERA_SEARCH_URL + encodeURIComponent(opera.searchName))
    .then(async html => {
      const $ = cheerio.load(html)
      if ($('#article table').length) {
        const rawTrs = $('#article table tr')
        let count = 0
        for (let i = 1; i < rawTrs.length; i++) {
          const tr = $(rawTrs[i])
          const className = tr.attr('class')
          if (/^row/g.test(className) && tr.find('b').length) {
            const operaId = tr.find('td').eq(0).text()
            const operaName = tr.find('td').eq(1).text()
            const operaSource = tr.find('td').eq(2).text()
            const operaPeriod = opera.period
            const operaInfo = {
              operaId,
              operaName,
              operaSource,
              operaPeriod
            }
            // 信息存入数据库
            await Opera.createOpera(operaInfo)
            count++
            if (count === rawTrs.length - 1) {
              return Promise.resolve()
            }
          }
        }
      } else {
        return null
      }
    })
}

/**
 * 获取所有搜索到的京剧名称和 id
 *
 * @param {*} operas
 * @returns
 */
const getAllSearchedList = operas => {
  const promises = operas.slice(130).map(opera => getSearchedList(opera))
  return Promise.all(promises)
}

/**
 * 代码主逻辑
 *
 * 1. 先获取所有朝代下的京剧剧本名称，数据格式：[{ name, period }]
 * 2. 对上一步获取的剧本名进行搜索，找到对应的 id，并筛选掉没有数据的剧本，数据格式：[{ operaId, operaName, operaSource, operaPeriod }]
 * 3. 将上一步获取的数据，存在数据库中
 *
 */
getAllOperaNameByPeriods(OPERA.OPERA_PERIODS)
  .then(ALL_OPERA_NAME => getAllSearchedList(ALL_OPERA_NAME))
  .then(res => console.log('----------finish-------------'))
  .catch(err => console.log('----------------finish error----------------', err))
