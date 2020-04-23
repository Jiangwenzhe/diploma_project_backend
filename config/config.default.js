/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-23 11:24:57
 */
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1584347320810_8594';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 创建 mongoose 连接
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/backend',
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0,
      useFindAndModify: false,
    },
  };

  // jwt
  config.jwt = {
    secret: 'wenzhe',
    enable: true, // default is false
    match: '/jwt', // optional
  };

  // 用户自定义静态文件
  config.TestCaseUploadServer = 'http://127.0.0.1:8100/testcase/';

  // egg-bus
  config.bus = {
    debug: true, // Debug 模式下会打印更多日志信息
    concurrency: 1, // Bull 中队列处理的并发数：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueprocess
    listener: {
    },
    job: {
      // 与 listener 一致，唯一不同的就是 默认 baseDir 的值为 `job`
    },
    bull: { // Bull 队列配置：https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queue
      redis: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
    },
    queue: {
      default: 'default', // 默认队列名称
      prefix: 'bus', // 队列前缀
    },
    queues: { // 针对不同队列单独配置
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
