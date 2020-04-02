/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 18:53:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 15:16:14
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 创建用户
  async create(payload) {
    const { ctx } = this;
    // 对于 name 做校验
    const doc = await ctx.service.user.findByName(payload.name);
    if (doc) {
      ctx.throw(400, '用户名已被占用');
    }
    const createdID = await ctx.service.id.createId('User');
    const newPayload = { ...payload, uid: createdID.id };
    try {
      const res = ctx.model.User.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
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

  // comm ------------------------------------
  // 通过name查询用户
  async findByName(name) {
    const { ctx } = this;
    return ctx.model.User.findOne({ name });
  }
  // 通过id查询用户
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.User.findById(_id);
  }
}

module.exports = UserService;
