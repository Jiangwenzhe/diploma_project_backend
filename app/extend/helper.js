/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 19:23:44
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-12 16:58:40
 */
'use strict';
const moment = require('moment');

// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss');

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.logger.info('current request info');
  ctx.body = {
    code: 0,
    data: res,
    msg,
  };
  ctx.status = 200;
};
