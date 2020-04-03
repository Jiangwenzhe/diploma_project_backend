/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-03 11:16:27
 */
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/api', controller.home.index);

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

  // 讨论/文章 discuss 操作相关的路由 ========================
  router.post('/api/discuss', jwt, controller.discuss.createDiscuss);
  router.get('/api/discuss/:id', controller.discuss.findSingleDiscussById);
  router.delete('/api/discuss/:id', jwt, controller.discuss.destroyDiscuss);
  router.post('/api/discuss/comment/:id', jwt, controller.discuss.createComment);
  // router.get('/api/discuss/like/:id', jwt, controller.discuss.like);
};
