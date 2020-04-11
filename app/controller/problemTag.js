/*
 * @Author: Wenzhe
 * @Date: 2020-04-11 10:39:58
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-11 14:14:45
 */
'use strict';

const Controller = require('egg').Controller;

class ProblemTagController extends Controller {
  async createTag() {
    const { ctx, service } = this;
    const payload = ctx.request.body || {};
    const res = await service.problemTag.create(payload);
    ctx.helper.success({ ctx, res });
  }

  async index() {
    const { ctx, service } = this;
    const res = await service.problemTag.index();
    ctx.helper.success({ ctx, res });
  }
}

module.exports = ProblemTagController;
