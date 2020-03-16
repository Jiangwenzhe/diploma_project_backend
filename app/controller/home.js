/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-16 16:33:42
 */
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'diploma_project_backend is running...';
  }
}

module.exports = HomeController;
