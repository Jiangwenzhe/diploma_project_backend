/*
 * @Author: Wenzhe
 * @Date: 2020-04-04 17:31:33
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-05 10:06:25
 */
'use strict';
const request = require('superagent');


const Controller = require('egg').Controller;

class TestcaseController extends Controller {
  async uploadTestcase() {
    const { ctx, service } = this;
    const res = await request.post('http://127.0.0.1:8100/testcase/')
      .type('form')
      .field('spj', false)
      .attach('file', '/Users/erzhuyijian/Desktop/毕业设计/代码/testcase/001/归档.zip');
    const payload = JSON.parse(res.text).data;
    const result = await service.testcase.create(payload);
    ctx.helper.success({ ctx, res: result });
  }
}

module.exports = TestcaseController;
