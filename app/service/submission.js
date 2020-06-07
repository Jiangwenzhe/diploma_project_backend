/*
 * @Author: Wenzhe
 * @Date: 2020-04-13 09:25:22
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-07 13:05:30
 */
'use strict';

const Service = require('egg').Service;
const request = require('superagent');
const { getLangueConfig } = require('../../config/languages');

class SubmissionService extends Service {
  async create(payload) {
    const { ctx, app } = this;
    try {
      const { status } = payload;
      if (status === 2) {
        const { pid, cid } = payload;
        const contest = await ctx.model.Contest.findOne({ cid });
        const { problemList } = contest;
        if (!problemList.includes(pid)) {
          ctx.throw(400, '当前比赛没有包含该题目');
        }
      }
      const submission = await ctx.model.Submission.create(payload);
      // 如果以后采用了消息队列的写法，就直接返回 submission_id
      // return { submission_id: submission._id };
      // 提交题目判题
      // const judge_result = await service.submission.judge(submission);
      app.bus.dispatch('handleSubmission', submission);
      // return judge_result;
      return submission;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  async judge(payload) {
    // 通过 superagent 与后台交互，返回判题信息
    const { service } = this;
    const { _id: submission_id, language, code, pid, uid } = payload;
    // 获取题目的数据信息
    const {
      limit_time: max_cpu_time,
      limit_memory,
      test_case_id,
      _id: problem_id,
    } = await service.problem.findByProblemId(pid);
    // 获取语言配置
    const language_config = getLangueConfig(language);
    const judgePayload = {
      src: code,
      language_config,
      max_cpu_time,
      max_memory: limit_memory * 1024 * 1024,
      test_case_id,
      output: false,
    };
    // 发送请求给判题服务器判题
    // TODO: 超时时间设置
    const judge_response = await request
      .post('http://127.0.0.1:8080/judge')
      .set(
        'X-Judge-Server-Token',
        'b824cecedb22b06c3883b1f1dd9dd3150608fc24f8d0c16b0f85af8c8c761667'
      )
      .send(judgePayload);
    const { data: judge_result_info, err } = judge_response.body;
    let cpu_time_cost_sum = 0;
    let memory_cost_sum = 0;
    let real_time__cost_sum = 0;
    const result_arr = [];
    // 当传入的程序编译错误时
    if (err) {
      // 为题目添加 status_info
      await service.problem.createStatusInfo(problem_id, -2);
      // 为用户添加 submit resolve
      await service.user.createStatusInfo(uid, -2, pid);
      const update_submission_response = await service.submission.update(
        submission_id,
        {
          result: -2,
          status_info: {
            score: 0,
            error_info: judge_result_info,
          },
        }
      );
      return update_submission_response;
    }
    judge_result_info.forEach(element => {
      cpu_time_cost_sum += element.cpu_time;
      memory_cost_sum += element.memory;
      real_time__cost_sum += element.real_time;
      result_arr.push(element.result);
    });
    // 当 result 中有 -1 时，就返回 -1, 如果没有，就返回数组的最大值
    const result = result_arr.includes(-1) ? -1 : Math.max(...result_arr);
    // 为题目添加 status_info
    await service.problem.createStatusInfo(problem_id, result);
    // 为用户添加 submit resolve
    await service.user.createStatusInfo(uid, result, pid);
    const update_res = await service.submission.update(submission_id, {
      result,
      info: {
        err,
        judge_result_info,
      },
      status_info: {
        //  / judge_result_info.length 所有的累加
        cpu_time_cost: Math.round(cpu_time_cost_sum),
        real_time__cost: Math.round(real_time__cost_sum),
        memory_cost: Math.round(memory_cost_sum),
      },
    });
    return update_res;
  }

  async update(_id, payload) {
    const { ctx } = this;
    const submission = await ctx.service.submission.findById(_id);
    if (!submission) {
      ctx.throw(404, 'submission not found');
    }
    try {
      const res = await ctx.model.Submission.findByIdAndUpdate(_id, payload, {
        new: true,
      });
      return res;
    } catch (e) {
      throw new Error(400, e);
    }
  }

  // ======================================= search =======================================
  // 获取所有题目，需要支持 antd 分页
  async index(payload) {
    const { ctx } = this;
    const {
      uid,
      pid,
      current,
      pageSize,
      status,
      cid,
      username,
      result,
      language,
    } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算skip
    const skip = (Number(current) - 1) * Number(pageSize || 10);
    if (uid) {
      query.uid = uid;
    }
    if (pid) {
      query.pid = pid;
    }
    if (cid) {
      query.cid = cid;
    }
    if (username) {
      query.username = new RegExp(username, 'i');
    }
    if (result && result + 4) {
      query.result = result;
    }
    if (language) {
      query.language = language;
      if (language === 'Cpp') {
        query.language = 'C++';
      }
    }
    // query
    if (status) {
      query.status = Number(status);
    } else {
      query.status = { $ne: 2 };
    }
    // 获取所有submission的数量
    total = await ctx.model.Submission.countDocuments(query).exec();
    res = await ctx.model.Submission.find(query)
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ create_at: -1 })
      .exec();
    const getUserAndProblemListDetail = res.map(async submission => {
      const { uid, pid } = submission;
      const itemObject = submission.toObject();
      const user = await ctx.model.User.findOne(
        { uid },
        { _id: 1, name: 1, submit: 1, solve: 1 }
      );
      const problem = await ctx.model.Problem.findOne(
        { pid },
        { _id: 1, title: 1 }
      );
      itemObject.userInfo = user;
      itemObject.problemInfo = problem;
      return itemObject;
    });
    const submissionListDetail = await Promise.all(getUserAndProblemListDetail);
    return { total, list: submissionListDetail, pageSize, current };
  }

  // 获取所有题目，需要支持 antd 分页
  async getUserQuestionsSubmittedRecords(payload) {
    const { ctx } = this;
    const {
      uid,
      pid,
    } = payload;
    const query = {};
    if (uid) {
      query.uid = uid;
    }
    if (pid) {
      query.pid = pid;
    }
    // 获取所有题目的数量
    const total = await ctx.model.Submission.countDocuments(query).exec();
    const submissions = await ctx.model.Submission.find(query);
    return { total, list: submissions };
  }

  // 通过 id 查询 submission
  async findById(_id) {
    const { ctx } = this;
    return await ctx.model.Submission.findById(_id);
  }

  // 通过 uid 查询 submission
  async findByUid(uid) {
    const { ctx } = this;
    const user_submission = await ctx.model.Submission.find({ uid }).exec();
    return user_submission;
  }
}

module.exports = SubmissionService;
