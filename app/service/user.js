/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 18:53:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-16 19:49:58
 */
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // TODO: 创建用户 需要避免重复创建
  async create(payload) {
    const { ctx } = this;
    return ctx.model.User.create(payload);
  }

  // TODO: 删除用户m
  async destory(_id) {
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

  // TODO: 查询用户
  async find(_id) {
    const { ctx } = this;
    return ctx.model.User.findById(_id);
  }
}

module.exports = UserService;
