/*
 * @Author: Wenzhe
 * @Date: 2020-03-16 16:28:48
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 11:46:28
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
  router.get('/api/user', controller.user.index);
  router.post('/api/user', controller.user.createUser);
  router.delete('/api/user/:id', controller.user.destroyUser);
  router.get('/api/user/:id', controller.user.findSingleUserById);
  router.get('/api/userinfo/:uid', controller.user.findSingleUserByUid);
  router.put('/api/user/:id', controller.user.updateUser);
  router.get('/api/user_discuss', jwt, controller.user.getUserCollection);
  router.post('/api/user_discuss', jwt, controller.user.userCollectDiscuss);
  router.delete('/api/user_discuss/:did', jwt, controller.user.cancelUserCollection);


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
  router.delete('/api/discuss/comment/:id', jwt, controller.discuss.deleteComment);
  router.post('/api/discuss/reply/:id', jwt, controller.discuss.createReply);
  router.delete('/api/discuss_delete_reply', jwt, controller.discuss.deleteReply);
  router.post('/api/discuss/joindiscuss/:id', jwt, controller.discuss.joinDiscuss);
  router.delete('/api/discuss/deleteDiscuss/:id', jwt, controller.discuss.deleteDiscuss);

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
  router.get('/api/get_user_problem_submission', controller.submission.getUserQuestionsSubmittedRecords);

  // rankList 操作相关路由 ============================
  router.get('/api/ranklist', controller.ranklist.index);

  // contest 操作相关路由
  router.get('/api/contest', controller.contest.index);
  router.post('/api/contest', jwt, controller.contest.createContest);
  router.put('/api/contest/:id', jwt, controller.contest.updateContest);
  router.delete('/api/contest/:id', jwt, controller.contest.deleteContest);
  router.get('/api/contest/:cid', jwt, controller.contest.findSingleContestByCid);
  router.get('/api/contest_tool/:id', jwt, controller.contest.getContestValueByid);
  // 校验用户权限
  router.post('/api/contest/verify', jwt, controller.contest.verifyUser);
  // contest 题目操作
  router.get('/api/contest_problem/:cid', jwt, controller.contest.getContestProblem);
  router.post('/api/contest_problem', jwt, controller.contest.addContestProblem);
  router.delete('/api/contest_problem', jwt, controller.contest.removeProblemFromContest);
  router.put('/api/contest_problem', jwt, controller.contest.updateProblemFromContest);
  // contest 获取题目
  router.get('/api/contest_problemDetail', jwt, controller.contest.getProblemInfoByCidAndPid);
  // contest 获取 rank
  router.get('/api/contest_ranklist/:cid', jwt, controller.contest.getContestRankList);

  // home 操作相关路由
  router.get('/api/home', controller.home.homeInfo);
  router.get('/api/log', controller.home.LogInfo);
};
