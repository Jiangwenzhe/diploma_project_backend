/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 18:53:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-17 12:37:03
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // TODO: 创建用户 需要避免重复创建
  async create(payload) {
    const { ctx } = this;
    // 对于 name 做校验
    const doc = await ctx.model.User.findOne({ name: payload.name });
    if (doc) {
      ctx.throw(400, '用户名已被占用');
    }
    return ctx.model.User.create(payload);
  }

  // TODO: 删除用户
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  // TODO: 更新用户
  async update(_id, payload) {
    const { ctx } = this;
    const user = await ctx.service.user.find(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  // TODO: 通过id查询用户
  async find(_id) {
    const { ctx } = this;
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    return ctx.model.User.findById(_id);
  }
}

module.exports = UserService;
