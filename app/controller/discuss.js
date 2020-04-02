/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 16:00:24
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 17:43:42
 */
'use strict';

const Controller = require('egg').Controller;

class DiscussController extends Controller {
  // 创建题目
  async createDiscuss() {
    const { ctx, service } = this;
    // TODO: 校验传入参数
    // ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.discuss.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 创建评论
  async createComment() {
    const { ctx, service } = this;
    // 获取 discuss id
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    const res = await service.discuss.createComment(id, payload);
    ctx.helper.success({ ctx, res });
  }
}

module.exports = DiscussController;
