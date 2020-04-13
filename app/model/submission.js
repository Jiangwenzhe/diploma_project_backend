/*
 * @Author: Wenzhe
 * @Date: 2020-04-13 08:33:47
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-13 16:12:05
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
  });
  return mongoose.model('Submission', SubmissionSchema);
};
