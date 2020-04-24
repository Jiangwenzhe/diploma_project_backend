/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:05:56
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-24 16:07:21
 */
'use strict';

const Controller = require('egg').Controller;

class RanklistController extends Controller {
  // 获取 ranklist (分页 / 关键字)
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.ranklist.index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = RanklistController;
