/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-17 14:00:20
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 用户 user 操作相关路由 =============================
  router.post('/api/user', controller.user.createUser);
  router.delete('/api/user/:id', controller.user.destroyUser);
  router.get('/api/user/:id', controller.user.findSingleUserById);
  router.put('/api/user/:id', controller.user.updateUser);
};
