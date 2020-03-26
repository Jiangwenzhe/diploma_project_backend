/*
 * @Author: Wenzhe
 * @Date: 2020-03-26 12:17:36
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-03-26 18:17:09
 */
'use strict';


module.exports = app => {
  const mongoose = app.mongoose;
  const ProblemSchema = new mongoose.Schema({
    isdone: Boolean,
    pid: {
      required: true,
      type: Number,
      index: {
        unique: true,
      },
      // default: -1, // 表示新题目
    },
    detail: {
      type: String,
    },
    time: {
      type: Number,
      default: 1000,
      min: 100,
      max: 10000,
    },
    memory: {
      type: Number,
      default: 32768,
      min: 100,
      max: 32768 * 4,
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
    input: {
      type: String,
      default: '',
    },
    output: {
      type: String,
      default: '',
    },
    in: {
      type: String,
      default: '',
    },
    out: {
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
  });

  ProblemSchema.pre('validate', function(next) {
    // 验证字段
    if (this.time > 10000) {
      next(new Error('Time should not be longer than 10000 ms'));
    } else if (this.memory > 32768 * 5) {
      next(new Error(`Memory should not be greater than ${32768 * 5} kb`));
    } else {
      next();
    }
  });

  return mongoose.model('Problem', ProblemSchema);
};
