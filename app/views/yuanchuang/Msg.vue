<template>
  <li class="original-subj-item">
    <div class="original-subj-item-img" :style="{'background-image': `url(${renderOriginalMsgImg(msg.Title, msg.Image)})`}"></div>
    <div class="original-subj-item-content">
      <a class="original-subj-item-title" :href="`/article/${msg.Id}`" target="_blank">
        <span class="original-own" style="vertical-align: middle" v-if="msg.SubjIds.indexOf('396') > -1">
          <i class="iconfont icon-px_qianbi"></i>
          独家
        </span>
        <span style="vertical-align: middle">{{msg.Title}}</span>
      </a>
      <p class="original-subj-item-summary">{{msg.Summary | truncate(85, '...')}}</p>
      <div class="original-subj-item-bottom">
        <stocks :stocks="msg.Stocks" />
        <span class="original-subj-item-time"><i class="iconfont icon-shijianicon"></i>{{msg.CreatedAt * 1000 | timeago}}</span>
      </div>
    </div>
  </li>
</template>

<script>
import Stocks from '~/components/Stocks'

export default {
  props: {
    msg: Object,
    active: Number
  },
  components: {
    Stocks
  },
  methods: {
    renderOriginalMsgImg (title, image) {
      const id = this.active
      if (id === 657 || !id) {
        return `${image.trim()}?imageView2/1/w/182/h/182` || '/img/default-original.png'
      } else if (id === 1) {
        if (title.indexOf('早餐') > -1) return '/img/default-original-1-day.png'
        else if (title.indexOf('晚报') > -1) return '/img/default-original-1-night.png'
        else return '/img/default-original.png'
      } else if (id === 8) {
        if (title.indexOf('主题复盘') > -1) return '/img/default-original-8-zhuti.png'
        else if (title.indexOf('公告复盘') > -1) return '/img/default-original-8-gonggao.png'
        else if (title.indexOf('涨停板复盘') > -1) return '/img/default-original-8-zhangtingban.png'
        else return '/img/default-original.png'
      } else if (id === 2) {
        if (title.indexOf('游资龙虎榜') > -1) return '/img/default-original-2-youzi.png'
        else if (title.indexOf('机构龙虎榜') > -1) return '/img/default-original-2-jigou.png'
        else return '/img/default-original.png'
      } else if (id === 5) {
        if (title.indexOf('晚间公告') > -1) return '/img/default-original-5-wanjian.png'
        else if (title.indexOf('午间公告') > -1) return '/img/default-original-5-wujian.png'
        else if (title.indexOf('周末公告') > -1) return '/img/default-original-5-zhoumo.png'
        else return '/img/default-original.png'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.original-subj-item {
  display: flex;
  margin-bottom: 8px;
  background: #fff;
  &-img {
    flex: 0 0 182px;
    width: 182px;
    height: 182px;
    background-position: center;
    background-size: cover;
  }
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
  }
  &-title {
    font-weight: bold;
    font-size: 18px;
    color: @mainFontColor;
    line-height: 26px;
    &:hover {
      color: @mainFontColorHover;
    }
  }
  &-summary {
    flex: 1;
    font-size: 14px;
    color: #666666;
    margin: 12px 0;
  }
  &-time {
    font-size: 12px;
    color: #9C9899;
    float: right;
    margin-top: 3px;
  }
  .icon-shijianicon {
    font-size: 12px;
    margin-right: 3px;
  }
}
</style>

