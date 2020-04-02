/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 14:55:02
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 17:31:12
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
      const res = await ctx.model.Problem.create(newPayload);
      // TODO: 后期可能需要加入写入 testcase 的活
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // TODO: 获取所有题目，需要支持 antd 分页
  async index(payload) {
    // TODO: 需要添加关键字模糊搜索 注意参考 leetcode 的实现
    const { current, pageSize } = payload;
    const { ctx } = this;
    let res = [];
    let total = 0;
    // 计算skip
    const skip = ((Number(current)) - 1) * Number(pageSize || 10);
    // 索取所有题目的数量
    total = await ctx.model.Problem.count({}).exec();
    res = await this.ctx.model.Problem.find({}, { title: 1, tags: 1, submit: 1, solve: 1 }).skip(skip).limit(Number(pageSize))
      .sort({ createdAt: -1 })
      .exec();
    return { total, list: res, pageSize, current };
  }

}

module.exports = ProblemsService;
