/*
 * @Author: Wenzhe
 * @Date: 2020-04-05 08:45:54
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-07 11:37:49
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const TestCaseSchema = new mongoose.Schema({
    test_case_id: {
      type: String,
    },
    info: Array,
    spj: Boolean,
    path: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  return mongoose.model('TestCase', TestCaseSchema);
};

