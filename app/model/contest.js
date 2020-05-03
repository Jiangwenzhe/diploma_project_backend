/*
 * @Author: Wenzhe
 * @Date: 2020-05-03 09:40:38
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-03 13:25:25
 */
'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const ContestSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    last_update_time: {
      type: Date,
      default: Date.now,
    },
    create_time: {
      type: Date,
      default: Date.now,
    },
    need_pass: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
    },
    peoblemList: {
      type: [ mongoose.Schema.Types.ObjectId ],
      default: [],
    },
    submissionList: {
      type: [ mongoose.Schema.Types.ObjectId ],
      default: [],
    },
    rank: [],
  });
  return mongoose.model('Contest', ContestSchema);
};
