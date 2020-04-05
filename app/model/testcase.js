/*
 * @Author: Wenzhe
 * @Date: 2020-04-05 08:45:54
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-05 09:39:31
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  return mongoose.model('TestCase', TestCaseSchema);
};

