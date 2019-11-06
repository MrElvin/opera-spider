require('./env')
const rp = require('request-promise-native')
const cheerio = require('cheerio')
const OPERA = require('./spiderConstants')
const Opera = require('./models/opera')

// [史记, 孤本元明杂剧, 今古奇观, 警世通言, 古今小说, 汉书, 醒世恒言, ]
const books = [
  { bookName: '三国演义', year: '三国' },
  { bookName: '列国演义', year: '周' },
  { bookName: '水浒传', year: '宋' },
  { bookName: '昭代箫韶', year: '宋' },
  { bookName: '史记', year: '' },
  { bookName: '聊斋志异', year: '清' },
  { bookName: '杨家将', year: '宋' },
  { bookName: '西游记', year: '唐' },
  { bookName: '说岳全传', year: '宋' },
  { bookName: '孤本元明杂剧', year: '' },
  { bookName: '封神演义', year: '商' },
  { bookName: '左传', year: '周' },
  { bookName: '说唐演义', year: '唐' },
  { bookName: '西汉演义', year: '西汉' },
  { bookName: '红楼梦', year: '清' },
  { bookName: '今古奇观', year: '' },
  { bookName: '三侠五义', year: '宋' },
  { bookName: '杨家将演义', year: '宋' },
  { bookName: '隋唐演义', year: '唐' },
  { bookName: '施公案', year: '清' },
  { bookName: '彭公案', year: '清' },
  { bookName: '警世通言', year: '' },
  { bookName: '宋史', year: '宋' },
  { bookName: '明英烈', year: '明' },
  { bookName: '残唐五代史演义', year: '唐' },
  { bookName: '明史', year: '明' },
  { bookName: '绿牡丹', year: '唐' },
  { bookName: '征东全传', year: '唐' },
  { bookName: '龙凤金钗传', year: '唐' },
  { bookName: '九美图', year: '明' },
  { bookName: '古今小说', year: '' },
  { bookName: '济公传', year: '宋' },
  { bookName: '忠义璇图', year: '宋' },
  { bookName: '汉书', year: '' },
  { bookName: '东汉演义', year: '东汉' },
  { bookName: '义侠记', year: '宋' },
  { bookName: '大唐秦王词话', year: '唐' },
  { bookName: '烈女传', year: '西汉' },
  { bookName: '醒世恒言', year: '' },
  { bookName: '三下南唐', year: '宋' },
  { bookName: '武王伐纣平话', year: '商' },
  { bookName: '水浒记', year: '宋' },
  { bookName: '续小五义', year: '宋' },
  { bookName: '薛家将反唐全传', year: '唐' },
  { bookName: '铁冠图', year: '明' },
  { bookName: '雷峰塔', year: '宋' },
  { bookName: '东周列国志', year: '周' },
  { bookName: '剧说', year: '宋' },
  { bookName: '升仙传', year: '明' },
  { bookName: '后水浒', year: '宋' },
  { bookName: '征西全传', year: '唐' },
  { bookName: '晋书', year: '晋' }
]

const getOperaFromBook = async book => {
  const html = await rp.get(OPERA.OPERA_BOOK_URL + encodeURIComponent(book.bookName))
  const $ = cheerio.load(html)
  const lis = $('#article .bullet')
  const result = []
  for (let i = 0; i < lis.length; i++) {
    const item = $(lis[i])
    result.push(item.text())
  }
  for (let i = 0; i < result.length; i++) {
    const opera = await Opera.getOperaByName(result[i])
    if (opera) {
      opera.operaBook = book.bookName
      if (book.year) {
        opera.operaPeriod = book.year
      }
      await opera.save()
    }
  }
}
(async function () {
  for (let i = 0; i < books.length; i++) {
    await getOperaFromBook(books[i])
  }
})()
