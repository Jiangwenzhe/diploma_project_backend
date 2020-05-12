/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-12 17:32:40
 */
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const readLastLines = require('read-last-lines');

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

  async homeInfo() {
    const { ctx, service } = this;
    const res = await service.home.getHomeInfo();
    ctx.helper.success({ ctx, res });
  }

  async SystemInfo() {
    const { ctx, service } = this;
    const res = await service.home.getHomeInfo();
    ctx.helper.success({ ctx, res });
  }

  async LogInfo() {
    const { ctx } = this;
    const logfile = path.join(path.resolve('./'), 'logs/diploma_project_backend/diploma_project_backend-web.log');
    const currentLogFile = await readLastLines.read(logfile, 80);
    ctx.helper.success({ ctx, res: currentLogFile });
  }

}

module.exports = HomeController;
