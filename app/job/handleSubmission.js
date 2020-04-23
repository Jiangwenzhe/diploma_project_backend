/*
 * @Author: Wenzhe
 * @Date: 2020-04-23 11:25:22
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-23 17:21:23
 */
'use strict';

const { Job } = require('egg-bus');

class HandleSubmissionJob extends Job {
  static get queue() {
    return 'submission_queue'; // 使用的队列名称
  }

  static get attempts() {
    return 5; // 重试次数
  }

  async run(data) {
    // job 任务运行时调用
    // 第一个参数是发送过来的数据
    // 第二个参数是 Bull 的原始 Job 对象
    // 通过 this.ctx 和 this.app 分别获取 egg 的 Context 和 Application 对象
    const { ctx } = this;
    // 模拟后台繁忙的情况
    // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    // await delay(5000);
    await ctx.service.submission.judge(data);
  }

  failed(data) {
    // 当 job 失败并重试达到限定次数后调用
    console.log(data);
  }
}

module.exports = HandleSubmissionJob;
