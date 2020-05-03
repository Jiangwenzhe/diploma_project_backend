/*
 * @Author: Wenzhe
 * @Date: 2020-04-13 08:33:47
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 09:53:10
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const SubmissionSchema = new mongoose.Schema({
    // 提交题目的id
    pid: {
      required: true,
      type: Number,
    },
    // 提交题目所使用的语言
    language: String,
    // 提交的代码
    code: String,
    create_at: {
      type: Number,
      default: Date.now,
    },
    uid: Number,
    username: String,
    result: Number,
    info: Object,
    shared: {
      type: Boolean,
      default: true,
    },
    status_info: Object,
    content: {
      type: String,
    },
    // status 是 1，代表 practice, 2 代表 contest
    status: {
      type: Number,
      default: 1,
    },
  });
  return mongoose.model('Submission', SubmissionSchema);
};
