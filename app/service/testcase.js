/*
 * @Author: Wenzhe
 * @Date: 2020-04-04 17:49:06
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-04 17:49:07
 */
'use strict';

const Service = require('egg').Service;

class TestcaseService extends Service {
  async upload(payload) {
    console.log('------------service file payload', payload);
  }
}

module.exports = TestcaseService;
