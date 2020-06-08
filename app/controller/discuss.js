/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 16:00:24
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 11:45:51
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

  // 获取所有文章(分页/模糊)
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service.discuss.index(payload);
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
    await service.discuss.addAccessCount(id);
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

  // 删除单条评论
  async deleteComment() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.discuss.deleteComment(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 创建评论回复
  async createReply() {
    const { ctx, service } = this;
    // 获取 comment id
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    const res = await service.discuss.createReply(id, payload);
    ctx.helper.success({ ctx, res });
  }

  // 删除单条回复
  async deleteReply() {
    const { ctx, service } = this;
    const { comment_id, reply_id } = ctx.query;
    const res = await service.discuss.deleteReply(comment_id, reply_id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 参与讨论 joinDiscuss
  async joinDiscuss() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body || {};
    const res = await service.discuss.joinDiscuss(id, payload);
    ctx.helper.success({ ctx, res });
  }

  // 删除单条 discuss
  async deleteDiscuss() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.discuss.deleteDiscuss(id);
    // 设置响应内容和响应状态码
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
