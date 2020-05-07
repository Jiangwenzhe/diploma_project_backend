/*
 * @Author: Wenzhe
 * @Date: 2020-04-24 16:07:26
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 17:00:15
 */
'use strict';

const Service = require('egg').Service;

function paginate(array, page_number, page_size) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

class RanklistService extends Service {
  async index(payload) {
    const { ctx } = this;
    const { name } = payload;
    const query = {};
    // let res = [];
    let total = 0;
    // 计算skip
    // const skip = (Number(current) - 1) * Number(pageSize || 10);

    if (name) {
      query.name = new RegExp(name, 'i');
    }

    total = await ctx.model.User.countDocuments(query).exec();
    // res = await ctx.model.User.aggregate([
    //   { $match: { name: name ? name : null } },
    //   {
    //     $project: {
    //       name: 1,
    //       uid: 1,
    //       motto: 1,
    //       solve: 1,
    //       submit: 1,
    //       failed_list: 1,
    //       solved_list: 1,
    //       submit_list: 1,
    //       solve_length: { $size: { $ifNull: [ '$solved_list', []] } },
    //     },
    //   },
    //   { $sort: { solve_length: -1 } },
    //   { $limit: Number(pageSize) },
    //   { $skip: skip },
    // ]);
    const userList = await ctx.model.User.find({})
      // .skip(skip)
      // .limit(Number(pageSize))
      .sort({ create_at: -1 })
      .lean()
      .exec();
    const calculatedUserList = userList.map(user => {
      if (user.solved_list && user.solved_list.length > 0) {
        const solve_length = user.solved_list.length;
        return { ...user, solve_length };
      }
      return { ...user, solve_length: 0 };
    });
    calculatedUserList.sort((a, b) => b.solve_length - a.solve_length);
    let res = calculatedUserList.map((user, index) => ({ ...user, rank: index + 1 }));
    if (name) {
      res = res.filter(item => {
        const reg = new RegExp(name, 'i');
        return reg.test(item.name);
      });
    }
    return { total, list: res };
  }
}

module.exports = RanklistService;
