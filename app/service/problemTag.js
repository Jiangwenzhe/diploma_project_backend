/*
 * @Author: Wenzhe
 * @Date: 2020-04-11 10:34:21
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-11 14:17:52
 */
'use strict';

const Service = require('egg').Service;

class ProblemTagsService extends Service {
  async create(payload) {
    const { ctx } = this;
    const { name } = payload;
    const tagIsExist = await ctx.model.ProblemTag.findOne({ name });
    if (tagIsExist && tagIsExist._id) {
      return 'tag is already exist';
    }
    const CreatedID = await ctx.service.id.createId('ProblemTag');
    const newPayload = { ...payload, tid: CreatedID.id };
    try {
      const res = await ctx.model.ProblemTag.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  async index() {
    const { ctx } = this;
    try {
      return ctx.model.ProblemTag.find({});
    } catch (e) {
      ctx.throw(400, e);
    }
  }
}

module.exports = ProblemTagsService;
