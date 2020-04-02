/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 15:58:23
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-04-02 18:05:13
 */
'use strict';

const Service = require('egg').Service;

class DiscussService extends Service {
  // create ==================================================
  async create(payload) {
    const { ctx, service } = this;
    const _id = ctx.state.user.data._id;
    const { name, avatar } = await service.user.findById(_id);
    console.log('================1', payload);
    const newPayload = {
      ...payload,
      author: {
        name,
        avatar_url: avatar,
      },
      author_id: _id,
    };
    console.log('================', newPayload);
    try {
      const res = await ctx.model.Discuss.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // create comment ====================================
  /**
   *
   * @param {*} payload
   *     const comment = new mongoose.Schema({
   *     user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
      username: String,
      avatar_utl: String,
      content: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
   */
  async createComment(duscuss_id, payload) {
    const { ctx, service } = this;
    const user_id = ctx.state.user.data._id;
    const { name, avatar } = await service.user.findById(user_id);
    console.log('------------new payload', payload);
    const newPayload = {
      ...payload,
      user_id,
      username: name,
      avatar_utl: avatar,
    };
    console.log('------------', newPayload);
    try {
      // const res = await ctx.model.Discuss.findById(duscuss_id).exec(function(err, discuss) {
      //   discuss.comments.push(payload);
      //   discuss.save();
      // });
      const result = await ctx.model.Discuss.update({ _id: duscuss_id }, {
        $push: {
          comments: newPayload,
        },
      });
      if (result.ok === 1) {
        return '评论添加成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 通过id查询discuss
  async findById(_id) {
    const { ctx } = this;
    return ctx.model.Discuss.findById(_id);
  }

}

module.exports = DiscussService;
