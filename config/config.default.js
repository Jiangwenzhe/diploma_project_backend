/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-17 22:52:23
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
      useUnifiedTopology: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  };

  // jwt
  config.jwt = {
    secret: 'wenzhe',
    enable: true, // default is false
    match: '/jwt', // optional
  };

  return {
    ...config,
    ...userConfig,
  };
};
