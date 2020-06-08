/*
 * @Author: Wenzhe
 * @Date: 2020-04-02 15:58:23
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-06-08 10:22:41
 */
'use strict';

const Service = require('egg').Service;

class DiscussService extends Service {
  // ======================================= create =======================================
  // 创建新的 discuss / article
  async create(payload) {
    const { ctx, service } = this;
    const _id = ctx.state.user.data._id;
    const { tags } = payload;
    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        await service.discussTag.create({ name: tags[i] });
      }
    }
    const newPayload = {
      ...payload,
      author_id: _id,
    };
    try {
      const res = await ctx.model.Discuss.create(newPayload);
      return res;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // ======================================= delete =======================================
  // 删除 单篇文章
  async destroy(_id) {
    const { ctx } = this;
    const discuss = await ctx.model.Discuss.findById(_id);
    if (!discuss) {
      ctx.throw(404, 'discuss not found');
    }
    // 对用户时候有权限删除这篇文章做校验
    const author_id = discuss.author_id;
    if (
      author_id.toString() === ctx.state.user.data._id.toString() ||
      ctx.state.user.data.privilege === 3
    ) {
      try {
        await ctx.model.Discuss.findByIdAndRemove(_id);
        return '删除成功';
      } catch (e) {
        throw new Error(400, e);
      }
    }
    throw new Error(400, '当前用户没有权限删除该文章');
  }

  // TODO: 低优先级 批量删除 文章
  // async deleteMulti(ids) {}

  // ======================================= update =======================================
  // TODO：修改 单篇文章的内容
  // async update(id, payload) {}
  async update(_id, payload) {
    const { ctx } = this;
    const discuss = await ctx.model.Discuss.findById(_id);
    if (!discuss) {
      ctx.throw(404, 'discuss not found');
    }
    const author_id = discuss.author_id;
    if (
      author_id.toString() === ctx.state.user.data._id.toString() ||
      ctx.state.user.data.privilege === 3
    ) {
      try {
        const res = await ctx.model.Discuss.findByIdAndUpdate(_id, payload, {
          new: true,
        });
        return {
          status: '修改成功',
          newValue: res,
        };
      } catch (e) {
        throw new Error(400, e);
      }
    }
    throw new Error(400, '当前用户没有权限编辑该文章');
  }

  // ======================================= search =======================================
  // 通过id查询 discuss
  async findById(_id) {
    const { ctx } = this;
    const discussInfo = await ctx.model.Discuss.findById(_id);
    const new_discussInfo = discussInfo.toObject();
    const authorInfo = await ctx.model.User.findById(new_discussInfo.author_id);
    new_discussInfo.authorInfo = authorInfo;
    if (discussInfo.discussList.length > 0) {
      const new_discussList = discussInfo.discussList.map(async item => {
        const itemObject = item.toObject();
        const authorInfo = await ctx.model.User.findById(
          itemObject.discuss_user_id,
          { _id: 1, name: 1, avatar: 1, uid: 1 }
        );
        itemObject.authorInfo = authorInfo;
        return itemObject;
      });
      const new_res = await Promise.all(new_discussList);
      new_discussInfo.discussList = new_res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (discussInfo.comments.length > 0) {
      const new_commentList = discussInfo.comments.map(async item => {
        const itemObject = item.toObject();
        const authorInfo = await ctx.model.User.findById(
          itemObject.comment_user_id,
          { _id: 1, name: 1, avatar: 1, uid: 1 }
        );
        itemObject.authorInfo = authorInfo;
        if (itemObject.replys.length > 0) {
          const new_replyList = itemObject.replys.map(async item => {
            // console.log(item);
            const itemObject = item;
            const authorInfo = await ctx.model.User.findById(
              itemObject.comment_user_id,
              { _id: 1, name: 1, avatar: 1, uid: 1 }
            );
            itemObject.authorInfo = authorInfo;
            return itemObject;
          });
          const new_res = await Promise.all(new_replyList);
          itemObject.replys = new_res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return itemObject;
      });
      const new_comment_res = await Promise.all(new_commentList);
      new_discussInfo.comments = new_comment_res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return new_discussInfo;
  }

  // 获取所有的文章，需要支持 antd 的分页
  // 1. 按照 category, tag,关键词 title 进行搜索
  async index(payload) {
    const { ctx } = this;
    const {
      current,
      pageSize,
      category,
      title,
      tag,
      type,
      author_id,
    } = payload;
    const query = {};
    let res = [];
    let total = 0;
    // 计算 skip
    const skip = (Number(current) - 1) * Number(pageSize || 10);
    // 组装 query
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    if (title) {
      query.title = new RegExp(title, 'i');
    }
    // 如果包含需要转义的字符，前端需要 encode
    if (tag) {
      const tags = tag.split(',');
      query.tags = {
        $all: tags,
      };
    }
    if (author_id) {
      query.author_id = author_id;
    }
    // 索取所有题目的数量
    total = await ctx.model.Discuss.countDocuments(query).exec();
    res = await this.ctx.model.Discuss.find(query)
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 })
      .exec();
    const res_add_author = res.map(async item => {
      const itemObject = item.toObject();
      const authorInfo = await ctx.model.User.findById(itemObject.author_id);
      itemObject.authorInfo = authorInfo;
      return itemObject;
    });
    const new_res = await Promise.all(res_add_author);
    return { total, list: new_res, pageSize, current };
  }

  // ======================================= others =======================================
  // TODO: 低优先级 为单个文章点赞 👍 like + 1, 可能需要 $inc 操作符
  // async like(_id) {
  // const { ctx } = this;
  // const currentUserID = ctx.state.user.data._id;
  // const likeList = await ctx.model.Discuss.findById({ _id }, { likeList: 1 });
  // console.log('-----------------123', typeof likeList, likeList);
  // if ([ ...likeList ].includes(currentUserID.toString())) {
  //   throw new Error('你之前已经点赞过啦');
  // }
  // try {
  //   await ctx.model.Discuss.findByIdAndUpdate(
  //     { _id },
  //     { $inc: { like: 1 }, $push: { likeList: currentUserID } },
  //     { upsert: true, new: true });
  //   const res = await ctx.model.Discuss.findById({ _id }, { _id: 1, like: 1, title: 1 });
  //   return res;
  // } catch (e) {
  //   ctx.throw(400, e);
  // }
  // }

  // TODO: 低优先级 为单个文章倒赞  dislike + 1,
  // async dislike(_id) {}

  async addAccessCount(_id) {
    const { ctx } = this;
    const discuss = await ctx.model.Discuss.findById(_id);
    if (!discuss) {
      ctx.throw(404, 'discuss not found');
    }
    try {
      const res = await ctx.model.Discuss.findByIdAndUpdate(
        { _id },
        { $inc: { access_number: 1 } },
        { new: true }
      );
      return res.access_number;
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // ==================================== comment ====================================
  // 添加一条评论，如果有时间，为评论加入点赞
  async createComment(duscuss_id, payload) {
    const { ctx } = this;
    const user_id = ctx.state.user.data._id;
    const newPayload = {
      ...payload,
      comment_user_id: user_id,
    };
    // console.log('------------', newPayload);
    try {
      // const res = await ctx.model.Discuss.findById(duscuss_id).exec(function(err, discuss) {
      //   discuss.comments.push(payload);
      //   discuss.save();
      // });
      const result = await ctx.model.Discuss.update(
        { _id: duscuss_id },
        {
          $push: {
            comments: newPayload,
          },
        }
      );
      if (result.ok === 1) {
        return '评论添加成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 删除评论
  async deleteComment(comment_id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Discuss.update(
        {},
        { $pull: { comments: { _id: comment_id } } },
        { multi: true }
      );
      if (result.ok === 1) {
        return '删除评论成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  async createReply(comment_id, payload) {
    const { ctx } = this;
    const user_id = ctx.state.user.data._id;
    const newPayload = {
      ...payload,
      comment_user_id: user_id,
    };
    try {
      const result = await ctx.model.Discuss.update(
        { 'comments._id': comment_id },
        {
          $push: {
            'comments.$.replys': newPayload,
          },
        }
      );
      if (result.ok === 1) {
        return '评论添加成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }


  // 删除回复
  async deleteReply(comment_id, reply_id) {
    console.log('into deleteReply');
    console.log(comment_id, reply_id);
    const { ctx } = this;
    try {
      const result = await ctx.model.Discuss.updateOne(
        { 'comments._id': comment_id },
        {
          $pull: {
            'comments.$.replys': { _id: reply_id },
          },
        },
        { multi: true }
      );
      if (result.ok === 1) {
        return '删除回复成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // ==================================== discuss ====================================
  async joinDiscuss(duscuss_id, payload) {
    const { ctx } = this;
    const user_id = ctx.state.user.data._id;
    const newPayload = {
      ...payload,
      discuss_user_id: user_id,
    };
    try {
      const result = await ctx.model.Discuss.update(
        { _id: duscuss_id },
        {
          $push: {
            discussList: newPayload,
          },
        }
      );
      if (result.ok === 1) {
        return '添加讨论成功';
      }
    } catch (e) {
      ctx.throw(400, e);
    }
  }

  // 删除评论
  async deleteDiscuss(discuss_id) {
    const { ctx } = this;
    try {
      const result = await ctx.model.Discuss.updateOne(
        { 'comments._id': comment_id },
        { $pull: { comments: { _id: discuss_id } } },
        { multi: true }
      );
      return result;
    } catch (e) {
      ctx.throw(400, e);
    }
  }
}

module.exports = DiscussService;
