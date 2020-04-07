/*
 * @Author: Wenzhe
 * @Date: 2020-04-04 17:49:06
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-07 16:04:17
 */
'use strict';

const Service = require('egg').Service;
const request = require('superagent');


class TestcaseService extends Service {
  async upload(payload) {
    const { service, config, ctx } = this;
    const { path } = payload;
    const res = await request.post(config.TestCaseUploadServer)
      .type('form')
      .field('spj', false)
      .attach('file', path);
    const data = JSON.parse(res.text).data;
    const result = await service.testcase.create({
      ...data,
      path,
    });
    ctx.logger.info('从执行用例上传服务器中返回的数据: %j', result);
    return result;
  }

  async create(payload) {
    const { ctx } = this;
    const { id, spj, info, path } = payload;
    const custom_payload = {
      test_case_id: id,
      spj,
      info,
      path,
    };
    try {
      const res = await ctx.model.Testcase.create(custom_payload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 通过 id 查询
  async findByTestCaseId(id) {
    const { ctx } = this;
    return ctx.model.Testcase.findOne({ test_case_id: id });
  }

}

module.exports = TestcaseService;
