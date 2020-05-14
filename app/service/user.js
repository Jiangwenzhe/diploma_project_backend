/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 18:53:20
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-14 13:17:58
 */
'use strict';

const Service = require('egg').Service;
const { difference_set } = require('../utils/tool_func');

class UserService extends Service {
  // 创建用户
  async create(payload) {
    const { ctx } = this;
    // 对于 name 做校验
    const doc = await ctx.service.user.findByName(payload.name);
    if (doc) {
      ctx.throw(400, '用户名已被占用');
    }
    const createdID = await ctx.service.id.createId('User');
    const newPayload = { ...payload, uid: createdID.id };
    try {
      const res = ctx.model.User.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 删除用户
  async destroy(_id) {
    const { ctx } = this;
    const user = await ctx.service.user.findById(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    return ctx.model.User.findByIdAndRemove(_id);
  }

  // 更新用户
  async update(_id, payload) {
    const { ctx } = this;
    const user = await ctx.service.user.findById(_id);
    if (!user) {
      ctx.throw(404, 'user not found');
    }
    // 对于 name 做校验
    if (user.name !== payload.name) {
      const doc = await ctx.model.User.findOne({ name: payload.name });
      if (doc) {
        ctx.throw(400, '用户名已被占用');
      }
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload, {
      new: true,
    });
  }

  // 分页获取用户
  async index(payload) {
    const { ctx } = this;
    const { current, pageSize, name } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算skip
    const skip = (Number(current) - 1) * Number(pageSize || 10);
    if (name) {
      query.name = new RegExp(name, 'i');
    }
    total = await ctx.model.User.countDocuments(query).exec();
    res = await ctx.model.User.find(query)
      .skip(skip)
      .limit(Number(pageSize))
      .sort()
      .exec();
    return { total, list: res, pageSize, current };
  }

  // comm ------------------------------------
  // 通过name查询用户
  async findByName(name) {
    const { ctx } = this;
    return ctx.model.User.findOne({ name });
  }
  // 通过id查询用户
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.User.findById(_id);
  }

  // 通过 uid 查询用户
  async findByUid(uid) {
    const { ctx } = this;
    return ctx.model.User.findOne({ uid });
  }

  // 与 submission 操作相关 ---------------------------
  // ⚠️ 这里的参数是 uid 而不是 _id
  async createStatusInfo(uid, judge_result, pid) {
    const { service, ctx } = this;
    const {
      solve,
      submit,
      submit_list,
      solved_list,
      failed_list,
    } = await service.user.findByUid(uid);

    console.log('pid', pid);

    const new_submit_list = new Set(submit_list);
    const new_solved_list = new Set(solved_list);
    const new_failed_list = new Set(failed_list);

    let new_submit = submit;
    new_submit += 1;
    new_submit_list.add(pid);
    let new_solve = solve;
    if (judge_result === 0) {
      new_solve += 1;
      new_solved_list.add(pid);
    } else {
      new_failed_list.add(pid);
    }

    const res = await ctx.model.User.findOneAndUpdate(
      { uid },
      {
        solve: new_solve,
        submit: new_submit,
        submit_list: [ ...new_submit_list ],
        solved_list: [ ...new_solved_list ],
        // different_set 会执行一个差集的操作
        failed_list: [ ...difference_set(new_failed_list, new_solved_list) ],
      },
      { new: true }
    );
    return res;
  }

  // 获取用户 solve, failed 的题目
  // ⚠️ 这里的参数是 uid 而不是 _id
  // 期望返回一个对象，包含一个数组 { solved_list: [pid, pid], failed_list: [pid, pid]}
  async findUserSubmitProblemInfo(uid) {
    const { service } = this;
    const user_submission = await service.submission.findByUid(uid);
    const solved_list = new Set();
    const failed_list = new Set();
    const submit_list = new Set();
    for (let i = 0; i < user_submission.length; i++) {
      submit_list.add(user_submission[i].pid);
      if (user_submission[i].result === 0) {
        solved_list.add(user_submission[i].pid);
      } else {
        failed_list.add(user_submission[i].pid);
      }
    }
    return {
      submit_list: [ ...submit_list ],
      solved_list: [ ...solved_list ],
      // different_set 会执行一个差集的操作
      failed_list: [ ...difference_set(failed_list, solved_list) ],
    };
  }

  // discuss 相关
  // 收藏文章
  async userCollectDiscuss(discuss_id) {
    const { ctx } = this;
    const { _id } = ctx.state.user.data;
    try {
      const result = await ctx.model.User.updateOne(
        { _id },
        {
          $addToSet: {
            collect_list: discuss_id,
          },
        }
      );
      if (result.ok === 1) {
        return '用户添加收藏成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 移除收藏文章
  async cancelUserCollection(discuss_id) {
    const { ctx } = this;
    const { _id } = ctx.state.user.data;
    try {
      const result = await ctx.model.User.updateOne(
        { _id },
        {
          $pull: {
            collect_list: discuss_id,
          },
        }
      );
      if (result.ok === 1) {
        return '用户取消收藏成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 获取用户收藏文章
  async getUserCollection() {
    const { ctx, service } = this;
    const { _id } = ctx.state.user.data;
    const { collect_list } = await ctx.model.User.findById(_id);
    if (collect_list.length === 0) {
      return [];
    }
    const reversed_collect_list = collect_list.reverse();
    const did_to_discuss = reversed_collect_list.map(async did => {
      const discuss = await service.discuss.findById(did);
      return discuss;
    });
    const user_collect_list = await Promise.all(did_to_discuss);
    return { list: user_collect_list, total: collect_list.length };
  }
}

module.exports = UserService;
