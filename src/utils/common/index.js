import login from './login/index.js'
import request from './request/index.js'

const common = {
  mixins: [request, login],

  async reload(msg) {
    if (!this.route) return
    wxTools.$stopPullDownRefresh(this)
    this.$clear()
    await this.$confirm({
      message: msg || '当前网络环境不好，请稍后再试',
      confirmButtonText: '重试'
    })
    const app = getApp()
    if (app && app.loginData) app.loginData.tokenStatus = 'none'

    let url = this.addQs(this.route, this.options)
    url = `/${url}`
    const isTabbar = this.isTabbar(url)
    if (isTabbar) {
      wx.reLaunch({
        url
      })
    } else {
      wx.redirectTo({
        url
      })
    }
  },
  $setData(data) {
    return new Promise(resolve => {
      this.setData(diff(data, this.data), resolve)
    })
  },
  updateApp() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(res => {
        // 请求完新版本信息的回调
        console.log('hasUpdate', res.hasUpdate)
      })
      updateManager.onUpdateReady(async _ => {
        await this.$confirm({
          title: '更新提示',
          message: '新版本已经准备好，是否重启应用？',
          confirmButtonText: '去更新'
        })
        updateManager.applyUpdate()
      })
    }
  },
  async onFormSubmit(event) {
    event.currentTarget.dataset = Object.assign({}, event.detail.target.dataset)
    const tap = event.detail.target.dataset.tap
    if (tap) {
      this[tap](event)
    }
    console.log('formId', event.detail.formId)
    if (event.detail.formId != 'the formId is a mock one') {
      const formId = [event.detail.formId] || []
      const token = await this.getToken()
      await this.api(api.user.apiPostFormId, {
        token: token,
        formId: JSON.stringify(formId)
      })
      console.log('formId', formId)
    }
  },

  _onShareAppMessage(data = {}) {
    let url = data.url || this.route
    const options = data.options || this.options
    url = this.addQs(url, { ...options,
      shareTitle: true
    })
    console.log(data, 'fuckaaaaaaa')
    return {
      title: data.title || '琥珀亲子',
      path: url,
      imageUrl: data.image || '',
      success: (res) => {
        console.log(res, 'fuckaaaaaaa')
        if (data.callback) data.callback(res)
        this.dataStatistics('viewPage', {
          'pagetitle': this.data.$viewport.title,
          'pagetitleusertype': this.data.$viewport.title + ',' + getApp().userType
        })
        const statistics = data.statistics || {}
        Object.keys(statistics).forEach(item => {
          this.dataStatistics('sharePage', {
            [item]: statistics[item]
          })
        })
      }
    }
  },
  $throttle(event) {
    const gapTime = 500

    const fn = event.currentTarget.dataset.fn

    const nowTime = +new Date()

    if (!this.__lastTapTime__ || nowTime - this.__lastTapTime__ > gapTime) {
      console.log(event)
      this[fn](event)
      this.__lastTapTime__ = nowTime
    }
  },
  $throttleDirect(gapTime = 500) {
    return new Promise((resolve, reject) => {
      const nowTime = +new Date()
      if (!this.__lastTapTime__ || nowTime - this.__lastTapTime__ > gapTime) {
        this.__lastTapTime__ = nowTime
        resolve()
      } else {
        reject('防抖节流抛出的reject，不用管它')
      }
    })
  },
  $exitAwait: error => Promise.reject(new Error(error)),
  $checkNetwork() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success(res) {
          const networkType = res.networkType
          resolve(networkType)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  async $isBiggerScreen() { // 增长--判断用户分辨率
    const system = await wxTools.getSystemInfo()
    if (system.screenHeight > 736) {
      return !0
    }
    return 0
  },
  $compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])
      if (num1 > num2) {
        return true
      } else if (num1 < num2) {
        return false
      }
    }
    return true
  }
}

export default common
