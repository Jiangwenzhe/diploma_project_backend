/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 14:55:02
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-10 09:52:35
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
      // 有关于导入 testcase 的问题就直接在内容中指定字段就可以了
      const res = await ctx.model.Problem.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }
  // ======================================= update =======================================
  async update(_id, payload) {
    const { ctx } = this;
    const problem = await ctx.service.problem.findById(_id);
    if (!problem) {
      ctx.throw(404, 'discuss not found');
    }
    try {
      const res = await ctx.model.Problem.findByIdAndUpdate(_id, payload, { new: true });
      return {
        status: '修改成功',
        newValue: res,
      };
    } catch (e) {
      throw new Error(400, e);
    }
  }

  // ======================================= search =======================================
  // 获取所有题目，需要支持 antd 分页
  async index(payload) {
    // TODO: 需要添加关键字模糊搜索 注意参考 leetcode 的实现
    const { ctx } = this;
    const { current, pageSize, title, tag } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算skip
    const skip = ((Number(current)) - 1) * Number(pageSize || 10);
    if (title) {
      query.title = new RegExp(title, 'i');
    }
    if (tag) {
      const tags = tag.split(',');
      query.tags = {
        $all: tags,
      };
    }
    // 索取所有题目的数量
    total = await ctx.model.Problem.count(query).exec();
    res = await this.ctx.model.Problem.find(query).skip(skip).limit(Number(pageSize))
      .sort({ createdAt: -1 })
      .exec();
    return { total, list: res, pageSize, current };
  }

  // 通过 id 查询 problem
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.Problem.findById(_id);
  }

}

module.exports = ProblemsService;
