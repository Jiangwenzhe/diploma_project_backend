/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-30 09:46:16
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
  router.get('/api/userinfo/:uid', controller.user.findSingleUserByUid);
  router.put('/api/user/:id', controller.user.updateUser);

  // 题目 problem 操作相关路由 =============================
  router.post('/api/problem', controller.problem.createProblem);
  router.get('/api/problem', controller.problem.index);
  router.get('/api/problem/:id', controller.problem.findSingleProblemById);
  router.get('/api/problemid/:pid', controller.problem.findSinglePeoblemByPid);
  router.get('/api/problem/testcase/:id', controller.problem.getTestCaseOfAProblemById);
  router.put('/api/problem/:id', controller.problem.updateProblem);
  router.delete('/api/problem/:id', controller.problem.deleteProblem);

  // 题目执行用例 testcase 操作相关路由
  router.post('/api/testcase', controller.testcase.uploadTestcase);

  // 讨论/文章 discuss 操作相关的路由 ========================
  router.post('/api/discuss', jwt, controller.discuss.createDiscuss);
  router.get('/api/discuss', controller.discuss.index);
  router.get('/api/discuss/:id', controller.discuss.findSingleDiscussById);
  router.put('/api/discuss/:id', jwt, controller.discuss.updateDiscuss);
  router.delete('/api/discuss/:id', jwt, controller.discuss.destroyDiscuss);
  router.post('/api/discuss/comment/:id', jwt, controller.discuss.createComment);
  // router.get('/api/discuss/like/:id', jwt, controller.discuss.like);

  // Tag 操作相关的路由 ================================
  // ProblemTag
  router.post('/api/problemtag', controller.problemTag.createTag);
  router.get('/api/problemtag', controller.problemTag.index);
  // DiscussTag
  router.post('/api/discusstag', controller.discussTag.createTag);
  router.get('/api/discusstag', controller.discussTag.index);

  // Submission 操作相关路由 ============================
  router.post('/api/submission', jwt, controller.submission.createSubmission);
  router.get('/api/submission', controller.submission.index);
  router.get('/api/submission/:id', controller.submission.findSingleSubmissionById);

  // rankList 操作相关路由 ============================
  router.get('/api/ranklist', controller.ranklist.index);
};
