/*
 * @Author: Wenzhe
 * @Date: 2020-04-13 09:27:52
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-08 23:04:36
 */
'use strict';

const Controller = require('egg').Controller;

class SubmissionController extends Controller {
  async createSubmission() {
    const { ctx, service } = this;
    const createSubmissionRule = {
      pid: { type: 'number' },
      language: [ 'C', 'C++', 'Java', 'Python2', 'Python3' ],
      code: { type: 'string' },
    };
    // 校验提交参数
    ctx.validate(createSubmissionRule);
    const req = ctx.request.body || {};
    // 获取提交用户的信息，组装参数
    const { _id } = ctx.state.user.data;
    const { uid, name } = await service.user.findById(_id);
    const payload = Object.assign(req, { uid, username: name });
    const res = await service.submission.create(payload);
    ctx.helper.success({ ctx, res });
  }

  // 获取所有 submission (分页 / )
  async index() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.submission.index(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取 单个问题 单个 user 的 submission
  async getUserQuestionsSubmittedRecords() {
    const { ctx, service } = this;
    // 组装参数
    const payload = ctx.query;
    // 调用 Service 进行业务处理
    const res = await service.submission.getUserQuestionsSubmittedRecords(
      payload
    );
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取单个 submission
  async findSingleSubmissionById() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.submission.findById(id);
    ctx.helper.success({ ctx, res });
  }
}

module.exports = SubmissionController;
