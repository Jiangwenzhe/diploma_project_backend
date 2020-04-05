/*
 * @Author: Wenzhe
 * @Date: 2020-04-04 17:49:06
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-05 10:12:34
 */
'use strict';

const Service = require('egg').Service;

class TestcaseService extends Service {
  async upload(payload) {
    console.log('------------service file payload', payload);
  }

  async create(payload) {
    const { ctx } = this;
    const { id, spj, info } = payload;
    const custom_payload = {
      test_case_id: id,
      spj,
      info,
    };
    try {
      const res = await ctx.model.Testcase.create(custom_payload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

}

module.exports = TestcaseService;
