module.exports = {
  common: {
    apiLogin: {
      url: '/user/login',
      method: 'POST'
    },
    // 获取用户信息
    apiGetUserInfo: {
      url: '/user/getUserInfo',
      method: 'GET'
    },

    //获取大盘数据
    apiGetBoard: {
      url: 'https://api.doctorxiong.club/v1/stock/board?token=W9hJ3pzvKU',
      method: 'GET',
      isNeedConfigUrl: false,
    }
  }
}
