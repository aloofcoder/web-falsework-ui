import { otherRoutes } from '@/router/index'
/* Layout */
import Layout from '@/layout'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

export function getRouterList(menus) {
  if (!menus || !menus instanceof Array) {
    return []
  }
  let menuTree = []
  menus.forEach(item => {
    let r = convertMenu2Router(item)
    if (item.parentId === 0) {
      menuTree.push(r)
    }
    menus.forEach(item1 => {
      if (item.id === item1.parentId) {
        if (!r.children) {
          r.children = []
        }
        let y = convertMenu2Router(item1)
        r.children.push(y)
      }
    })
  })
  // 将菜单排序
  toSortMenu(menuTree);
  menuTree.push(...otherRoutes)
  return menuTree
}

export function toSortMenu(menuTree) {
  menuTree.sort(function (a, b) {
    return a.sort - b.sort
  })
  menuTree.forEach(item => {
    if (item.children && item.children.length > 0) {
      toSortMenu(item.children)
    }
  })
}


export function convertMenu2Router(item) {
  let r = {
    sort: item.menuSort,
    hidden: item.isHidden === 1 ? true : false,
    path: item.menuPath,
    // component: item.menuClass === 1 ? Layout : loadView(item.menuComponent),
    component: item.menuClass === 1 ? Layout : loadView(item.menuComponent),
    name: item.menuName,
    meta: { title: item.menuName }
  }
  if (item.menuRedirect) {
    r.redirect = item.menuRedirect
  }
  if (item.menuIcon) {
    r.meta.icon = item.menuIcon
  }
  return r;
}


// 路由懒加载
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}

export function getAuthList(auths) {
  return auths.map(item => item.menuMark)
}
