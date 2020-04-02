/*
 * @Author: Wenzhe
 * @Date: 2020-03-17 16:14:04
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 16:11:06
 */
'use strict';

const Service = require('egg').Service;

class UserAccessService extends Service {
  async login(payload) {
    const { ctx, service } = this;
    const user = await service.user.findByName(payload.name);
    if (!user) {
      ctx.throw(404, '找不到该用户');
    }
    const verifyPsw = (payload.password === user.password);
    if (!verifyPsw) {
      ctx.throw(404, '你的密码错了');
    }
    // 生成 Token
    return { token: await service.makeToken.apply(user._id, user.privilege, user.name) };
  }

  async current() {
    const { ctx, service } = this;
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.state.user.data._id;
    const user = await service.user.findById(_id);
    if (!user) {
      ctx.throw(404, 'user is not found');
    }
    return user;
  }
}

module.exports = UserAccessService;
