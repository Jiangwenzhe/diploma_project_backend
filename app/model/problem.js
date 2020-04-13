/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 12:17:36
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-13 16:59:56
 */
'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const ProblemSchema = new mongoose.Schema({
    isdone: Boolean,
    // 这里的 pid 可以自增
    // 考虑 default 使用时间戳代替，以免当系统出现问题时，pid 没有输入
    pid: {
      required: true,
      type: Number,
      index: {
        unique: true,
      },
    },
    detail: {
      type: String,
    },
    limit_time: {
      type: Number,
      default: 1000,
      min: 100,
      max: 10000,
    },
    limit_memory: {
      type: Number,
      default: 256,
    },
    title: {
      type: String,
      required: true,
    },
    create: {
      type: Number,
      default: Date.now,
    },
    description: {
      type: String,
      default: '',
    },
    sample_input: {
      type: String,
      default: '',
    },
    sample_output: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    solve: {
      type: Number,
      default: 0,
    },
    submit: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
    },
    tags: {
      type: [ String ],
      default: [],
    },
    languages: {
      type: [ String ],
      default: [ 'C', 'C++', 'Java', 'Python2', 'Python3' ],
    },
    test_case_id: String,
    test_case_score: [ Object ],
    difficulty: {
      type: 'String',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    status_info: {
      type: Object,
      default: {},
    },
  });

  return mongoose.model('Problem', ProblemSchema);
};
