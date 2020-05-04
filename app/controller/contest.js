/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 13:08:03
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 23:37:16
 */
'use strict';

const Controller = require('egg').Controller;

class ContestController extends Controller {
  // 创建 contest
  async createContest() {
    const { ctx, service } = this;
    if (ctx.state.user.data.privilege !== 3) {
      ctx.throw(400, '您没有权限创建该比赛');
    }
    // ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.contest.create(payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取所有文章(分页/模糊)
  async index() {
    const { ctx, service } = this;
    const payload = ctx.query;
    const res = await service.contest.index(payload);
    ctx.helper.success({ ctx, res });
  }

  // 更新 contest
  async updateContest() {
    const { ctx, service } = this;
    if (ctx.state.user.data.privilege !== 3) {
      ctx.throw(400, '您没有权限修改该比赛');
    }
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    // ctx.validate(UserRule, ctx.request.body);
    // 组装参数
    const payload = ctx.request.body || {};
    const res = await service.contest.update(id, payload);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }

  // 获取单篇文章
  async findSingleContestByCid() {
    const { ctx, service } = this;
    const { cid } = ctx.params;
    const res = await service.contest.getContestDetailByCid(cid);
    ctx.helper.success({ ctx, res });
  }

  // 校验用户是否有权限访问比赛
  async verifyUser() {
    const { ctx, service } = this;
    const payload = ctx.request.body || {};
    const { password, cid } = payload;
    const verifyResult = await service.contest.validatePass(cid, password);
    ctx.helper.success({ ctx, res: verifyResult });
  }

  // 删除 contest
  async deleteContest() {
    const { ctx, service } = this;
    if (ctx.state.user.data.privilege !== 3) {
      ctx.throw(400, '您没有权限删除该比赛');
    }
    const { id } = ctx.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      ctx.throw(400, 'id参数错误');
    }
    const res = await service.contest.destory(id);
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res });
  }
}

module.exports = ContestController;
