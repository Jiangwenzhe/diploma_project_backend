/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 19:11:42
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-14 12:57:53
 */
'use strict';

const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const UserRule = {
  name: { type: 'string', required: true, allowEmpty: false },
  password: { type: 'password', required: true, allowEmpty: false, min: 6 },
  description: { type: 'string', required: false, allowEmpty: true },
};

class UserController extends Controller {
  // 创建用户
  async createUser() {
    const { ctx, service } = this;
    // 校验传入参数
    ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.user.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
  // 删除用户
  async destroyUser() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    await service.user.destroy(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx });
  }
  // 修改用户
  async updateUser() {
    const { ctx, service } = this;
    // ctx.validate(UserRule, ctx.request.body);
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const payload = ctx.request.body || {};
    const res = await service.user.update(id, payload);
    ctx.helper.success({ ctx, res });
  }
  // 根据id查询单个用户
  async findSingleUserById() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.user.findById(id);
    const msg = res === null ? '没有该用户' : null;
    ctx.helper.success({ ctx, res, msg });
  }

  // 根据uid查询单个用户
  async findSingleUserByUid() {
    const { ctx, service } = this;
    const { uid } = ctx.params;
    const res = await service.user.findByUid(uid);
    const msg = res === null ? '没有该用户' : null;
    ctx.helper.success({ ctx, res, msg });
  }

  // 分页获取 user
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.user.index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // user 收藏 collect
  async userCollectDiscuss() {
    const { ctx, service } = this;
    const payload = ctx.request.body || {};
    const { did } = payload;
    const res = await service.user.userCollectDiscuss(did);
    ctx.helper.success({ ctx, res });
  }

  async cancelUserCollection() {
    const { ctx, service } = this;
    const { did } = ctx.params;
    const res = await service.user.cancelUserCollection(did);
    ctx.helper.success({ ctx, res });
  }

  async getUserCollection() {
    const { ctx, service } = this;
    const res = await service.user.getUserCollection();
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UserController;
