let Constant = function (value) {
  for (let key of Object.keys(value)) {
    this[key] = value[key]
  }
}

let filter = function (key) {
  if (typeof key !== 'number') key = parseInt(key)
  return this[key] || 'Unknown'
}

Constant.prototype.getFilter = function () {
  return filter.bind(this)
}

Constant.prototype.toArray = function () {
  let arr = []
  for (let key of Object.keys(this)) {
    arr.push({ key, value: this[key] })
  }
  return arr
}

export default {
  grade: new Constant({
    0: '不限',
    1: '大一',
    2: '大二',
    3: '大三',
    4: '大四',
    5: '研究生'
  }),
  sex: new Constant({
    0: '不限',
    1: '男',
    2: '女'
  }),
  campus: new Constant({
    0: '无信息',
    1: '北洋园校区',
    2: '卫津路校区'
  })
}
