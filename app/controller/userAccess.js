/*
 * @Author: Wenzhe
 * @Date: 2020-03-17 19:25:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-18 11:32:26
 */
'use strict';

const Controller = require('egg').Controller;

// 用户登录校验
const UserLoginRule = {
  name: { type: 'string', required: true, allowEmpty: false },
  password: { type: 'string', required: true, allowEmpty: false },
};

class UserAccessController extends Controller {
  // 用户登录
  async login() {
    const { ctx, service } = this;
    ctx.validate(UserLoginRule, ctx.request.body);
    const payload = ctx.request.body || {};
    const res = await service.userAccess.login(payload);
    ctx.helper.success({ ctx, res });
  }

  // 获取用户信息
  async current() {
    const { ctx, service } = this;
    const res = await service.userAccess.current();
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = UserAccessController;
