/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 12:54:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 13:56:59
 */
'use strict';

const Service = require('egg').Service;

class ContestService extends Service {
  // 创建比赛
  async create(payload) {
    const { ctx } = this;
    const user_id = ctx.state.user.data._id;
    const newPayload = {
      ...payload,
      created_by: user_id,
    };
    try {
      const res = await ctx.model.Contest.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 删除 contest
  async destory(_id) {
    const { ctx } = this;
    const contest = await ctx.model.Contest.findById(_id);
    if (!contest) {
      ctx.throw(404, 'contest not found');
    }
    try {
      await ctx.model.Contest.findByIdAndRemove(_id);
      return '删除成功';
    } catch (e) {
      throw new Error(400, e);
    }
  }

  // 更新 contest
  async update(_id, payload) {
    const { ctx } = this;
    const contest = await ctx.model.Contest.findById(_id);
    if (!contest) {
      ctx.throw(404, 'contest not found');
    }
    try {
      const res = await ctx.model.Contest.findByIdAndUpdate(_id, payload, {
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

  // 获取所有的文章，需要支持 antd 的分页
  // 1. 按照 category, tag,关键词 title 进行搜索
  async index(payload) {
    const { ctx } = this;
    const { current, pageSize, title } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算 skip
    const skip = (Number(current) - 1) * Number(pageSize || 10);
    // 组装 query
    if (title) {
      query.title = new RegExp(title, 'i');
    }
    // 索取所有比赛的数量
    total = await ctx.model.Contest.countDocuments(query).exec();
    res = await this.ctx.model.Contest.find(query)
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 })
      .exec();
    const res_add_author = res.map(async item => {
      const itemObject = item.toObject();
      const authorInfo = await ctx.model.User.findById(itemObject.created_by);
      itemObject.authorInfo = authorInfo;
      return itemObject;
    });
    const new_res = await Promise.all(res_add_author);
    return { total, list: new_res, pageSize, current };
  }
}

module.exports = ContestService;
