/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 18:53:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-17 14:00:01
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 创建用户
  async create(payload) {
    const { ctx } = this;
    // 对于 name 做校验
    const doc = await ctx.model.User.findOne({ name: payload.name });
    if (doc) {
      ctx.throw(400, '用户名已被占用');
    }
    return ctx.model.User.create(payload);
  }

  // 删除用户
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.findById(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  // 更新用户
  async update(_id, payload) {
    console.log('--updaye', _id, payload);
    const { ctx } = this;
    const user = await ctx.service.user.findById(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    // 对于 name 做校验
    if (user.name !== payload.name) {
      const doc = await ctx.model.User.findOne({ name: payload.name });
      if (doc) {
        ctx.throw(400, '用户名已被占用');
      }
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload);
  }

  // 通过id查询用户
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.User.findById(_id);
  }
}

module.exports = UserService;
