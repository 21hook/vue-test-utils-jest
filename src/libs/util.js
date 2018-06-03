import { baseURL } from './http/HTTP'

export default {
  // 获得指定url参数，不存在返回false
  getUrlParam (key) {
    const urlArrs = location.search.substr(1).split('&')
    const urlParams = {}
    urlArrs.forEach((item) => {
      const oneParam = item.split('=')
      urlParams[oneParam[0]] = oneParam[1]
    })
    return urlParams[key]
  },
  /**
     * [时间格式化函数]
     * @param  {[timestamp]} timestamp   [需要转化的时间戳]
     * @param  {[Stirng]} format [转化格式]
     * @return {[String]}        [时间]
     */
  formatDateNew (timestamp, format) {
    if (!timestamp) {
      return ''
    }
    const time = new Date(timestamp)
    const addZero = str => str.toString().padStart(2, '0')
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
      switch (a) {
        case 'yyyy':
          return addZero(time.getFullYear())
        case 'MM':
          return addZero(time.getMonth() + 1)
        case 'dd':
          return addZero(time.getDate())
        case 'HH':
          return addZero(time.getHours())
        case 'mm':
          return addZero(time.getMinutes())
        default:
          return addZero(time.getSeconds())
      }
    })
  },
  isValidBarcode (str) {
    return /^([0-9]\d*)$/.test(str)
  },
  checkPointTwo (str) {
    if (/^\d+(\.\d{1,2})?$/g.test(str)) {
      return true
    }
    return false
  },
  // 返回字符串长度，汉字转化为2个长度
  returnStrLength (str) {
    if (str === null) {
      return 0
    }
    return str.toString().replace(/[\u0391-\uFFE5]/g, 'aa').length
  },
  // 纯字符串长度，不区分中英文
  returnEnStrLength (str) {
    if (str === null) {
      return 0
    }
    return str.toString().length
  },
  /**
     * [提示框]
     * @param  {[String]} text    [提示文字]
     * @param  {[String]} tipType [提示类型：1.succeed, 2.failed, 3.notice]
     * @param  {[Number]} timer   [显示时间]
     * @return {[Boolean]}         [是否成功]
     */
  toast (text, tipType, timer, call) {
    const classObj = {
      succeed: 'toast-icon-ok',
      failed: 'toast-icon-false',
      notice: 'toast-icon-notice'
    }
    // 之前显示的弹层 没有销毁之前 不创建新的 直接return 掉
    if (document.getElementById('J_Toast')) {
      return false
    }
    const clazz = classObj[tipType] ? classObj[tipType] : (`toast-icon-${tipType}`)
    const root = document.createElement('div')
    root.style.cssText = 'z-index:100000 !important;'
    root.id = 'J_Toast'
    root.className = 'toast'
    root.innerHTML = `<div class="toast-cont"><i class="toast-icon ${clazz}"></i><p class="toast-text">${text}</p></div>`
    document.body.appendChild(root)
    if (timer) {
      clearTimeout(timer)
    }
    setTimeout(() => {
      const parentElement = document.getElementById('J_Toast')
      parentElement.parentNode.removeChild(parentElement)
      call && call()
    }, timer)
    return true
  },
  getStorage (key) {
    const value = JSON.parse(localStorage.getItem(key)) || {}
    return value
  },
  setStorage (key, data) {
    localStorage.setItem(key, JSON.stringify(data))
  },
  spliteByComma (str) {
    if (!str) {
      return []
    }
    const strArray = str.replace(/(\s*\,\s*)|(\s*，\s*)/g, ',').split(',')
    return strArray
  },
  //  将source 合并到targe去重 id为合并的索引对比项
  mergeObjToArray (target = [], source = [], id = 'id') {
    for (let i = 0; i < source.length; i += 1) {
      if (!target.length) {
        target.push(source[i])
      } else {
        for (let k = 0; k < target.length; k += 1) {
          if (source[i][id] === target[k][id]) {
            break
          } else if (k === (target.length - 1) && source[i][id] !== target[k][id]) {
            target.push(source[i])
          }
        }
      }
    }
    return target
  },
  timeFormat (val) {
    if (!val) {
      return null
    }
    const t = new Date(val)
    console.log(t)
    return `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`
  },
  timeFormatSafari (val) {
    if (!val) {
      return null
    }
    const t = new Date(val)
    console.log(t)
    return `${t.getFullYear()}/${(t.getMonth() + 1).toString().padStart(2, '0')}/${t.getDate().toString().padStart(2, '0')} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`
  },
  // 正数
  numberValidate (num) {
    const reg = /^(([1-9]+[0-9]*(\.[0-9]+)?)|(0\.([1-9][0-9]*|[0-9][1-9][0-9]*)))$/
    if (reg.test(num)) return false
    return true
  },
  intValidate (num) {
    const reg = /^([0-9]+[0-9]*)$/
    if (reg.test(num)) return false
    return true
  },
  dividePrice (val) {
    return val == null ? null : (+val / 100).toFixed(2)
  },
  multiplyPrice (val) {
    return val == null ? null : (+val * 100).toFixed(0)
  },
  uploadBannerUrl: `${baseURL}/message/oss/imgUpload`,
  imgCdnPath: 'http://cdn.elephtribe.com/',
  localTime: {
    filters: {
      localTime (val) {
        if (!val) {
          return null
        }
        const t = new Date(val)
        return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()} ${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`
      },
      DateTimer (dataStr, timeStr) {
        const date = new Date(dataStr)
        const time = new Date(timeStr)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}  ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}`
      }
    }
  }
}
