// 小程序更新检测
export function mpUpdate () {
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate(res => {
    // 请求完新版本信息的回调
    console.log(res.hasUpdate)
  })
  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '检测到新版本，是否下载新版本并重启小程序？',
      success (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })
  updateManager.onUpdateFailed(() => {
    // 新的版本下载失败
    uni.showModal({
      title: '已经有新版本了哟~',
      content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      showCancel: false
    })
  })
}

// 随机打乱一个从1-25的数组
export function shuffleArray (array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 驼峰转换下划线
export function toLine (name: string) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const getTimerStr = (diff: number) => {
  if (!diff) return ''
  return Math.floor(diff / 1000) + '.' + (diff % 1000) + "''"
}
