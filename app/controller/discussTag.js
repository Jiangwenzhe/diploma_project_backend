/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 09:37:23
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 09:38:02
 */
'use strict';

const Controller = require('egg').Controller;

class DiscussTagController extends Controller {
  async createTag() {
    const { ctx, service } = this;
    const payload = ctx.request.body || {};
    const res = await service.discussTag.create(payload);
    ctx.helper.success({ ctx, res });
  }

  async index() {
    const { ctx, service } = this;
    const res = await service.discussTag.index();
    ctx.helper.success({ ctx, res });
  }
}

module.exports = DiscussTagController;
