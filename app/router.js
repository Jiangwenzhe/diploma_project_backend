/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-28 14:34:39
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/', controller.home.index);

  // 用户访问 userAccess 相关操作路由
  router.post('/api/user/access/login', controller.userAccess.login);
  router.get('/api/user/access/current', jwt, controller.userAccess.current);
  // router.get('/api/user/access/current', app.jwt, controller.userAccess.current);
  // router.get('/api/user/access/logout', controller.userAccess.logout);
  // router.put('/api/user/access/resetPsw', app.jwt, controller.userAccess.resetPsw);

  // 用户 user 操作相关路由 =============================
  router.post('/api/user', controller.user.createUser);
  router.delete('/api/user/:id', controller.user.destroyUser);
  router.get('/api/user/:id', controller.user.findSingleUserById);
  router.put('/api/user/:id', controller.user.updateUser);

  // 题目 problem 操作相关路由 =============================
  router.post('/api/problem', controller.problems.createProblem);
  router.get('/api/problem', controller.problems.index);
};
