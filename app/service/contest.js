/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 12:54:16
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-07 16:11:00
 */
'use strict';

const Service = require('egg').Service;

class ContestService extends Service {
  // 创建比赛
  async create(payload) {
    const { ctx } = this;
    const user_id = ctx.state.user.data._id;
    const { id } = await ctx.service.id.createId('Contest');
    const newPayload = {
      ...payload,
      cid: id,
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
      .sort({ create_time: -1 })
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

  async validatePass(cid, pass) {
    const { ctx } = this;
    const { password, need_pass } = await ctx.model.Contest.findOne({ cid });
    if (!need_pass || pass === password) {
      const { _id } = ctx.state.user.data;
      const { uid } = await ctx.model.User.findById(_id);
      // 将 uid 写入 contest 的 verifyList
      await ctx.model.Contest.updateOne(
        { cid },
        {
          $addToSet: {
            verifyList: uid,
          },
        }
      );
      return 'success';
    }
    return 'verify error';
  }

  // 按照 cid 获取 content
  async getContestDetailByCid(cid) {
    const { ctx, service } = this;
    const { _id } = ctx.state.user.data;
    const { uid } = await ctx.model.User.findById(_id);
    const contentDetail = await ctx.model.Contest.findOne({ cid });
    // 获取 problemList
    const problemList = contentDetail.problemList.map(async pid => {
      const problem = await service.problem.findByProblemId(pid);
      return problem;
    });
    const problemListInfo = await Promise.all(problemList);
    contentDetail.problemList = problemListInfo;
    const verifyList = contentDetail.verifyList;
    if (verifyList.includes(uid)) {
      return contentDetail;
    }
    return 'verify error';
  }

  // 按照 id 获取 contest
  async getContestById(id) {
    const { ctx } = this;
    const contest = await ctx.model.Contest.findById(id);
    return contest;
  }

  // 获取 contest 页面
  async getContestProblem(cid) {
    const { ctx } = this;
    const contest = await ctx.model.Contest.findOne({ cid });
    const { problemList } = contest;
    if (problemList.length === 0) {
      return [];
    }
    const getproblemListDetail = problemList.map(async pid => {
      const problem = await ctx.model.Problem.findOne({ pid });
      return problem;
    });
    const problemListDetail = await Promise.all(getproblemListDetail);
    return problemListDetail;
  }

  // 为 contest 添加题目
  async addContestProblem(cid, pid) {
    const { ctx } = this;
    try {
      const updated_res = await ctx.model.Contest.updateOne(
        { cid },
        {
          $addToSet: {
            problemList: Number(pid),
          },
        },
        { new: true }
      );
      return {
        status: 'success',
        newValue: updated_res,
      };
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 为 contest 修改题目
  async updateContestProblem(payload) {
    const { ctx } = this;
    const { cid, pidList } = payload;
    try {
      const updated_res = await ctx.model.Contest.updateOne(
        { cid },
        {
          problemList: pidList,
        },
        { new: true }
      );
      return {
        status: 'success',
        newValue: updated_res,
      };
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 为 contest 删除题目
  async removeContestProblem(cid, pid) {
    const { ctx } = this;
    try {
      const updated_res = await ctx.model.Contest.findOneAndUpdate(
        { cid },
        {
          $pull: {
            problemList: Number(pid),
          },
        },
        { new: true, safe: true, upsert: true }
      ).exec();
      return {
        status: 'success',
        newValue: updated_res,
      };
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // ================== contest problem 操作 ===================
  async getProblemInfoByCidAndPid(cid, pid) {
    const { ctx, service } = this;
    const contest = await ctx.model.Contest.findOne({ cid });
    const { problemList } = contest;
    if (!problemList.includes(pid)) {
      ctx.throw(400, '当前比赛没有包含该题目');
    }
    const problemDetail = await service.problem.findByProblemId(pid);
    return problemDetail;
  }

  // ================== contest rank 操作 ===================
  async getContestRankList(cid) {
    const { ctx, service } = this;
    const contestInfo = await ctx.model.Contest.findOne({ cid });
    const { start_time, end_time, verifyList, problemList } = contestInfo;
    console.log('-------------');
    console.log(verifyList);
    // verifyList
    // 现在是正序传递
    const submissionList = await ctx.model.Submission.find(
      { cid },
      { pid: 1, uid: 1, create_at: 1, result: 1 }
    )
      .lean()
      .exec();
    const userSubmissionList = verifyList.map(uid => {
      const singleUserSubmission = submissionList.filter(
        submission => submission.uid === uid
      );
      const problemSubmission = problemList.map(pid => {
        const singleProblemSolution = singleUserSubmission.filter(submission => submission.pid === pid);
        let ac_time = null;
        let waCount = 0;
        for (let i = 0; i < singleProblemSolution.length; i++) {
          const submission = singleProblemSolution[i];
          // 当答案为 wrong answer 时 waCount++
          if (submission.result === -1) {
            waCount++;
          }
          if (submission.result === 0) {
            ac_time = submission.create_at;
            break;
          }
        }
        return { [pid]: { waCount, ac_time } };
      });
      return { [uid]: problemSubmission };
    });
    return userSubmissionList;
  }
}

module.exports = ContestService;
