/*
 * @Author: Wenzhe
 * @Date: 2020-04-13 09:27:52
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-13 10:10:49
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
}

module.exports = SubmissionController;
