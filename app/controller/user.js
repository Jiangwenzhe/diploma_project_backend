/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 19:11:42
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-16 19:47:45
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
}

module.exports = UserController;
