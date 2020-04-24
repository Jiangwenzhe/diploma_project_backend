/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:07:26
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-24 17:18:31
 */
'use strict';

const Service = require('egg').Service;

class RanklistService extends Service {
  async index(payload) {
    const { ctx } = this;
    const { current, pageSize } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算skip
    const skip = (Number(current) - 1) * Number(pageSize || 10);

    total = await ctx.model.User.count(query).exec();
    res = await ctx.model.User.aggregate([
      {
        $project: {
          name: 1,
          uid: 1,
          motto: 1,
          solve: 1,
          submit: 1,
          failed_list: 1,
          solved_list: 1,
          submit_list: 1,
          solve_length: { $size: { $ifNull: [ '$solved_list', []] } },
        },
      },
      { $sort: { solve_length: -1 } },
      { $limit: Number(pageSize) },
      { $skip: skip },
    ]);
    return { total, list: res, pageSize, current };
  }
}

module.exports = RanklistService;
