/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-28 20:46:37
 */
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const res = {
      app_status: 'running',
      current_time: moment().format('YYYY-MM-DD, HH:mm:ss'),
    };
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = HomeController;
