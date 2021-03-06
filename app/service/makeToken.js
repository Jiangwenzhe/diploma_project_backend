/*
 * @Author: Wenzhe
 * @Date: 2020-03-17 18:50:00
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 16:08:27
 */
'use strict';

const Service = require('egg').Service;

class MakeTokenService extends Service {
  async apply(_id, privilege, name) {
    const { ctx } = this;

    return ctx.app.jwt.sign({
      data: {
        _id,
        name,
        privilege,
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    }, ctx.app.config.jwt.secret);
  }
}

module.exports = MakeTokenService;
