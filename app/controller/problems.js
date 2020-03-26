/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 15:02:40
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-26 18:22:41
 */
'use strict';

const Controller = require('egg').Controller;

class ProblemsController extends Controller {
  // 创建用户
  async createProblem() {
    const { ctx, service } = this;
    // TODO: 校验传入参数
    // ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.problem.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = ProblemsController;
