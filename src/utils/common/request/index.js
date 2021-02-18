import { config } from '../../../config/index.js'

const makeOptions = (options) => {
  const defaultoptions = {
    url: undefined,
    method: 'GET',
    // qs: undefined,
    data: undefined,
    headers: undefined,
    type: 'json',
    contentType: 'application/json'
  }

  let thisoptions = {}
  if (typeof options === 'string') {
    thisoptions.url = options
  } else {
    thisoptions = options
  }
  thisoptions = Object.assign({}, defaultoptions, thisoptions)

  return thisoptions
}

module.exports = {

  methods: {
    async api(options = {}, data = {}) {
      return await this.request({
        ...options,
        data
      })
    },
    request(options) {
      const opts = makeOptions(options)
      const {
        method,
        data,
        headers,
        // qs,
        type,
        contentType
      } = opts

      let requestUrl = ''
      if (opts.isNeedConfigUrl){
        requestUrl = `${config.configUrl}${opts.url}`
      }else {
        requestUrl = opts.url
      }
      // if (qs) requestUrl = addQs(requestUrl, qs)

      let header = headers

      if ((!headers || !headers['content-type']) && contentType) {
        header = Object.assign({}, headers, {
          'content-type': contentType
        })
      }

      return new Promise((resolve, reject) => {
        wx.request({
          url: requestUrl,
          method,
          data: data,
          header,
          dataType: type,
          success: async response => {
            const res = {
              status: response.statusCode,
              statusText: response.errMsg,
              data: response.data
            }
            if (response.statusCode < 200 || response.statusCode >= 300) {
              reject(res)
            } else if (res.data.code != 200) {
              reject(res)
            } else {
              resolve(res.data)
            }
          },
          fail: async(err) => {
            reject(err)
          }
        })
      })
    }
  },
}
