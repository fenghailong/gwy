// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const get_options = {
    method: 'GET',
    url: 'http://47.99.214.1:8080/get_stock_em_hold_stock_df'
  };
  //获取get请求数据

  const get_res= await rp(get_options );

  return get_res
}