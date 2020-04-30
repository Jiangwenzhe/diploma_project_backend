/*
 * @Author: Wenzhe
 * @Date: 2020-04-30 09:35:18
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 09:50:38
 */
'use strict';

const Service = require('egg').Service;

class DiscussTagsService extends Service {
  async create(payload) {
    const { ctx } = this;
    const { name } = payload;
    const tagIsExist = await ctx.model.DiscussTag.findOne({ name });
    if (tagIsExist && tagIsExist._id) {
      return 'tag is already exist';
    }
    const CreatedID = await ctx.service.id.createId('DiscussTag');
    const newPayload = { ...payload, tid_discuss: CreatedID.id };
    try {
      const res = await ctx.model.DiscussTag.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  async index() {
    const { ctx } = this;
    try {
      return ctx.model.DiscussTag.find({});
    } catch (e) {
      ctx.throw(400, e);
    }
  }
}

module.exports = DiscussTagsService;
