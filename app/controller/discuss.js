/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 16:00:24
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-03 11:34:31
 */
'use strict';

const Controller = require('egg').Controller;

class DiscussController extends Controller {
  // 创建文章
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

  // 删除单篇文章
  async destroyDiscuss() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.discuss.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取单篇文章
  async findSingleDiscussById() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.discuss.findById(id);
    ctx.helper.success({ ctx, res });
  }

  // 修改单篇文章
  async updateDiscuss() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const payload = ctx.request.body || {};
    const res = await service.discuss.update(id, payload);
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

  // 点赞一篇文章
  // async like() {
  //   const { ctx, service } = this;
  //   const { id } = ctx.params;
  //   if (!id.match(/^[0-9a-fA-F]{24}$/)) {
  //     ctx.throw(400, 'id参数错误');
  //   }
  //   const res = await service.discuss.like(id);
  //   ctx.helper.success({ ctx, res });
  // }
}

module.exports = DiscussController;
