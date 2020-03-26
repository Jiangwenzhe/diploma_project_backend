/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 14:55:02
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-26 18:19:46
 */

'use strict';

const Service = require('egg').Service;

class ProblemsService extends Service {
  // 新建题目
  // TODO: 加入参数校验
  async create(payload) {
    const { ctx } = this;
    const CreatedID = await ctx.service.id.createId('Problem');
    const newPayload = { ...payload, pid: CreatedID.id };
    try {
      const res = ctx.model.Problem.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // TODO: 获取所有题目，需要支持 antd 分页
}

module.exports = ProblemsService;
