<template>
  <li 
    :id="`news${msg.Id}`"
    :class="{
      'news-item': true,
      'dayLast': msg.dayLast
    }"
  >
    <div class="news-item-timeline">
      <div class="news-item-timeline-date">
        <div class="news-item-timeline-date-month">{{msg.CreatedAtInSec * 1000 | formatDate('M')}}月</div>
        <div class="news-item-timeline-date-day">{{msg.CreatedAtInSec * 1000 | formatDate('DD')}}</div>
      </div>
      <div
        :class="{
          'news-item-timeline-indicator-dot': true,
          [isBigNews]: true
        }"
      >
        <i v-if="msg.SubjIds" class="icon-baozha iconfont"></i>
      </div>
      <div :class="{
        'news-item-timeline-time': true,
        [isBigNews]: true
        }"
      >
        {{msg.CreatedAtInSec * 1000 | formatDate('HH:mm')}}
      </div>
    </div>
    <div class="news-item-main">
      <div class="news-item-container">
        <div class="news-item-container-info">
          <div :class="{'news-item-title': true, [isBigNews]: true}">
            <a :href="`/article/${msg.Id}`" target="_blank">
              <span v-if="msg.NeedExplained && !msg.ExplainInfos" class="news-item-title-needexplain">解读中</span>
              {{msg.Title}}
            </a>
            <bullish-and-bear :msg="msg" />
          </div>
          <div class="news-item-detail" v-if="msg.Summary">
            <pre class="news-item-detail-summary normal-pre-text">{{msg.Summary}}</pre>
          </div>
          <div v-if="hasStocks || hasBkj">
            <div class="news-item-intro" v-if="hasStocks">
              <stocks :stocks="msg.Stocks" />
            </div>
            <div class="news-item-intro" v-if="hasBkj">
              <a v-for="bkj in msg.BkjInfoArr" :key="bkj.Id" :href="`/theme/${bkj.Id}`" target="_blank" class="news-item-intro-topic">{{bkj.Name}}</a>
            </div>
          </div>

          <article class="explained-article" v-for="explainMsg in msg.ExplainInfos" :key="explainMsg.ExplainMsgId">
            <time class="explained-article-time"><i class="iconfont icon-daxinwenyuanwen"></i><span>{{ explainMsg.ExplainMsgTime * 1000 | formatDate('MM月DD日 HH:mm')}}</span></time>
            <a class="explained-article-title" :href="`/article/${explainMsg.ExplainMsgId}`" target="_blank">
              <span class="news-item-title-explain">解读</span>
              <span>{{ explainMsg.ExplainMsgTitle }}</span>
            </a>
            <pre v-if="explainMsg.ExplainMsgSummary" class="explained-article-summary normal-pre-text">{{ explainMsg.ExplainMsgSummary }}</pre>
          </article>

        </div>
        <div class="news-item-image">
          <img v-if="msg.Image" class="news-item-image-img lightbox" :src="msg.Image" :data-src="msg.Image" ref="image" />
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import Stocks from '~/components/Stocks'
import BullishAndBear from './BullishAndBear'

export default {
  components: {
    Stocks,
    BullishAndBear
  },
  props: {
    msg: {
      type: Object
    }
  },
  computed: {
    isBigNews () {
      return this.msg.SubjIds.indexOf('10') > -1 ? 'big-news' : ''
    },
    hasStocks () {
      return this.msg.Stocks && this.msg.Stocks.length
    },
    hasBkj () {
      return this.msg.BkjInfoArr && this.msg.BkjInfoArr.length
    }
  },
  mounted () {
    if (this.msg.Image) {
      window.lightGallery(this.$refs.image, {
        selector: 'this'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables.less";

.dayLast .news-item-timeline-date {
  display: block;
}

.news-item:first-of-type .news-item-timeline-date {
  display: block;
  background: @mainColorRed;
}

.news-item {
  position: relative;
  display: flex;
  width: 100%;
  &-timeline {
    width: 70px;
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: 35px;
    border-left: 1px dashed #d8d8d8;
    position: relative;
    &-date {
      display: none;
      position: absolute;
      left: -21px;
      top: -20px;
      width: 40px;
      height: 40px;
      padding: 2px;
      border-radius: 50%;
      background: #dedede;
      color: #fff;
      z-index: 10;
      &-month {
        text-align: center;
        font-size: 12px;
        margin-top: 2px;
      }
      &-day {
        text-align: center;
        font-size: 18px;
        line-height: 20px;
        padding: 0;
        margin: 0;
        margin-top: -2px;
      }
    }
    &-time {
      position: absolute;
      top: 27px;
      left: 20px;
      width: 60px;
      font-size: 16px;
      color: @fc-primary;
      &.big-news {
        color: @mainColorRed;
      }
    }
    &-indicator {
      width: 8px;
      position: absolute;
      left: -4px;
      top: 30px;
      bottom: 0;
      &-dot {
        position: absolute;
        width: 9px;
        height: 9px;
        left: -5px;
        top: 32px;
        background: #fff;
        border: 1px solid #919599;
        border-radius: 50%;
        .icon-baozha {
          display: none;
        }
        .iconfont {
          position: absolute;
          width: 8px;
          height: 8px;
          top: -15px;
          left: -7px;
          font-size: 22px;
          color: @mainColorRed;
        }
        &.big-news {
          border-color: transparent;
          top: 35px;
          .icon-baozha {
            display: block;
          }
        }
      }
    }
  }
  &-main {
    flex: 1 1 0%;
    padding-bottom: 24px;
    display: flex;
    .news-item-container {
      padding: 24px 30px 0 0;
      border-top: 1px solid @border-color-light;
      flex: 1 1 0%;
      display: flex;
      &-info {
        flex: 1 1 0%;
        display: block;
      }
      .news-item-title {
        color: @fc-primary;
        font-size: 16px;
        display: block;
        a {
          color: @fc-primary;
          cursor: default;
          vertical-align: middle;
        }
        &.big-news {
          color: @mainColorRed;
          a {
            color: @mainColorRed;
          }
        }
        &-explain {
          padding: 2px 7px;
          font-size: 14px;
          background: #E6394D;
          border-radius: 8px 0 8px 0;
          margin-right: 5px;
          color: #fff;
        }
        &-needexplain {
          padding: 2px 7px;
          font-size: 14px;
          background: #E6E6E6;
          color: #666;
        }
      }
      .news-item-detail {
        padding-top: 10px;
        display: flex;
        position: relative;
        &-summary {
          flex: 1;
          color: @fc-gray;
          font-size: 14px;
          letter-spacing: 0;
          line-height: 26px;
          flex: 1 1 0%;
          padding-right: 0;
          display: block;
          word-wrap: break-word;
        }
      }
      .news-item-image {
        padding: 0;
        flex-grow: 0;
        flex-shrink: 0;
        padding-left: 20px;
        & > img {
          display: block;
          max-width: 100px;
          cursor: pointer;
          height: 100px;
          width: 100px;
        }
      }
    }
  }

  &-intro {
    display: inline-block;
    padding-top: 10px;
    margin-right: 12px;
    &-topic {
      display: inline-block;
      font-size: 12px;
      border: 1px solid #4c5466;
      color: #4c5466;
      background: #fff;
      line-height: 12px;
      padding: 4px;
      margin-right: 4px;
      transition: 0.2s;
      &:hover {
        display: inline-block;
        font-size: 12px;
        border: 1px solid #4c5466;
        line-height: 12px;
        padding: 4px;
        color: #fff;
        background: #4c5466;
      }
    }
  }
  &:last-child .news-item-timeline-indicator-line {
    display: none;
  }
  .news-item-dayfirst-line {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    height: 1px;
    background: @border-color-light;
  }
  // 解读文章
  &.isExplain {
    background: #fafafa;
    border-left: 1px solid #E6394D;
    .explained-article-time, 
    .normal-pre-text {
      background: #fafafa;
    }
    .news-item-timeline {
      margin-left: 34px;
    }
    .news-item-container {
      border: none;
    }
    & + .news-item {
      .news-item-container {
        border: none;
      }
    }
  }
}

.stock-group-box {
  display: inline-block;
  margin-right: 15px;
}
</style>

