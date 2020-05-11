/*
 * @Author: Wenzhe
 * @Date: 2020-05-10 18:29:03
 * @LastEditors: Wenzhe
 * @LastEditTime: 2020-05-11 12:08:49
 */
'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async getHomeInfo() {
    const { ctx } = this;
    // 资讯模块 -- 取 news 模块的前4 个
    const news_info = await this.ctx.model.Discuss.find({ category: 'news' })
      .limit(Number(4))
      .sort({ createdAt: -1 })
      .exec();
    const news_authored = news_info.map(async item => {
      const itemObject = item.toObject();
      const authorInfo = await ctx.model.User.findById(itemObject.author_id);
      itemObject.authorInfo = authorInfo;
      return itemObject;
    });
    const news = await Promise.all(news_authored);

    // 比赛信息 -- 取最新创建的三个
    const contest = await this.ctx.model.Contest.find({})
      .limit(3)
      .sort({ create_time: -1 })
      .exec();

    // 文章 -- 最多点击的前三个
    const hot_info = await this.ctx.model.Discuss.find({})
      .limit(Number(4))
      .sort({ access_number: -1 })
      .exec();

    const hot_info_authored = hot_info.map(async item => {
      const itemObject = item.toObject();
      const authorInfo = await ctx.model.User.findById(itemObject.author_id);
      itemObject.authorInfo = authorInfo;
      return itemObject;
    });
    const hot = await Promise.all(hot_info_authored);

    return {
      news,
      contest,
      hot,
    };
  }
}

module.exports = HomeService;
