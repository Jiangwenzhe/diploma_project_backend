/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 16:03:57
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-26 16:17:56
 */

'use strict';

const Service = require('egg').Service;

class IdService extends Service {
  async createId(field) {
    const { ctx } = this;
    try {
      const res = this.ctx.model.Id.findOneAndUpdate({ name: field }, { $inc: { id: 1 } }, { upsert: true, new: true }).exec();
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }
}

module.exports = IdService;
