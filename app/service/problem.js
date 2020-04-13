/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 14:55:02
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-13 17:26:49
 */

'use strict';

const Service = require('egg').Service;

class ProblemsService extends Service {
  // 新建题目
  // TODO: 加入参数校验
  async create(payload) {
    const { ctx, service } = this;
    const { tags } = payload;
    for (let i = 0; i < tags.length; i++) {
      await service.problemTag.create({ name: tags[i] });
    }
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
      ctx.throw(404, 'problem not found');
    }
    try {
      const res = await ctx.model.Problem.findByIdAndUpdate(_id, payload, {
        new: true,
      });
      return {
        status: '修改成功',
        newValue: res,
      };
    } catch (e) {
      throw new Error(400, e);
    }
  }
  // ======================================= delete =======================================
  async delete(_id) {
    const { ctx } = this;
    const problem = await ctx.service.problem.findById(_id);
    if (!problem) {
      ctx.throw(404, 'problem not found');
    }
    try {
      const res = await ctx.model.Problem.findByIdAndRemove(_id);
      return {
        status: '删除成功',
        res,
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
    const skip = (Number(current) - 1) * Number(pageSize || 10);
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
    res = await this.ctx.model.Problem.find(query)
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ create: -1 })
      .exec();
    return { total, list: res, pageSize, current };
  }

  // 通过 id 查询 problem
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.Problem.findById(_id);
  }

  // 通过 pid 获取单个题目
  async findByProblemId(pid) {
    const { ctx } = this;
    return ctx.model.Problem.findOne({ pid });
  }

  // 通过 _id 来添加解答信息
  async createStatusInfo(_id, judge_result) {
    const { service, ctx } = this;
    const { status_info, solve, submit } = await service.problem.findById(_id);
    let new_submit = submit;
    new_submit += 1;
    let new_solve = solve;
    if (judge_result === 0) {
      new_solve += 1;
    }
    const new_status_info = status_info ? JSON.parse(JSON.stringify(status_info)) : {};
    let current_result_count = new_status_info[judge_result] ? new_status_info[judge_result] : 0;
    current_result_count += 1;
    new_status_info[judge_result] = current_result_count;
    const res = await ctx.model.Problem.findByIdAndUpdate(
      _id,
      { status_info: new_status_info, submit: new_submit, solve: new_solve },
      { new: true }
    );
    return res;
  }
}

module.exports = ProblemsService;
