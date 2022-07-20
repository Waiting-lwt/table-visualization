/* 
 * 用proxy写了一个深度绑定option数据更新，然后setOption的小方法
 */
const chartOptionBind = (myChart: echarts.ECharts, option: any) => {
  // 深度绑定
  const prox = (obj_: any) => {
    return new Proxy(obj_, {
      get(target, key, receiver) {
        return target[key]
      },
      set(target, key, value, receiver) {
        target[key] = value
        setTimeout(() => {
          myChart?.setOption(option)
        })
        return true
      },
    })
  }
  // 深度遍历
  const MyProxy = (obj: any) => {
    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach((v: any, i: number) => {
          if (typeof v === 'object') {
            obj[i] = MyProxy(v)
          }
        })
      } else {
        Object.keys(obj).forEach((v) => {
          if (typeof obj[v] === 'object') {
            obj[v] = MyProxy(obj[v])
          }
        })
      }
      // 数据代理
      return prox(obj)
    }
    return false
  }
  const proxyObj = MyProxy(option)
  if (!proxyObj) return new TypeError('Argument must be object or array')
  return proxyObj
}

export { chartOptionBind }
