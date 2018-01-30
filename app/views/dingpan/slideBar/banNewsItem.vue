<template>
<div class="ban-news-item" :class="{'big-news':isBigNews}">
 <div class="ban-news-item-timeline">
	  <div class="ban-news-item-timeline-indicator">
      <div class="ban-news-item-timeline-indicator-line"></div>
      <div :class="{'big-news':isBigNews}" class="ban-news-item-timeline-indicator-dot"></div>
    </div>
    <div :class="{'big-news':isBigNews}" class="ban-news-item-timeline-time ">
      {{timeFormatter(item.CreatedAtInSec, 'HH:mm:ss')}}
    </div>
  </div>
  <div class="ban-news-item-main">
    <div class="ban-news-item-container">
      <div :class="{'big-news':isBigNews}" class="ban-news-item-container-time ">
      {{timeFormatter(item.CreatedAtInSec, 'HH:mm:ss')}}
    </div>
      <div class="ban-news-item-container-info">
        <div :class="{'big-news':isBigNews}" class="ban-news-item-title ">
          <a :href="`/article/`+item.Id" target="_blank" :title="item.Title">{{item.Title}}</a>
        </div>
        <div v-if="item.Summary" class="ban-news-item-detail">
          <pre class="ban-news-item-detail-summary normal-pre-text">{{item.Summary}}</pre>
        </div>
      </div>
      <div v-if="item.Image" class="ban-news-item-image">
        <img  class="ban-news-item-image-img lightbox" :src="item.Image" :data-src="item.Image" />
      </div>
      <div class="ban-news-item-intro">
        <!-- <div v-if="item.Stocks" class="stock-group">
            <a v-for="s in item.Stocks" class="stock-group-item" :key="s.Symbol" :data-stock-target="s.Symbol" :href="`/stock/`+s.Symbol" target="_blank">
              <i class="iconfont icon-gupiaodie"></i>
              <span>{{s.Name}}</span>
              <span class="stock-group-item-rate"></span>
            </a>
        </div> -->
        <div class="stock-group" v-if="item.Stocks">
          <stocks :stocks="item.Stocks" />
          </div>
        <div  class="theme-group" v-if="item.BkjInfoArr && item.BkjInfoArr.length">
          <a target="_blank" :href="`/theme/`+b.Id" :key="b.Id" v-for="b in item.BkjInfoArr" class="ban-news-item-intro-topic">
            {{b.Name}}
          </a>
        </div>
      </div>
    </div>
  </div>
	</div>
</template>
<script>
/* eslint-disable */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import Stocks from '~/components/Stocks'
export default {
  props: ["item"],
  computed: {
    isBigNews() {
      return this.item.SubjId && this.item.SubjIds.indexOf("10") > -1;
    }
  },
  components:{
    Stocks
  },
  mixins: [shareMethodMixin]
};
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.ban-news-item {
  display: flex;
  // flex-direction: column;
  position: relative;
  background: #fafafa;
  &-timeline {
    position: relative;
    flex: 0 0 72px;
    padding-top: 16px;
    &-date {
      display: block;
      position: absolute;
      left: 0;
      width: 40px;
      top: -10px;
      height: 44px;
      background: $mainColorRed;
      color: #fff;
      &-month {
        text-align: center;
        font-size: 12px;
      }
      &-day {
        text-align: center;
        font-size: 24px;
        line-height: 24px;
        padding: 0;
        margin: 0;
      }
      &-cross {
        background: @border-color-dark;
      }
    }
    &-time {
      // position: absolute;
      // right: 0;
      // width: 60px;
      // font-size: 16px;
      padding-left: 16px;
      font-size: 12px;
      color: #666666;
      line-height: 24px;
      &.big-news {
        color: @mainColorRed;
      }
    }
    &-indicator {
      width: 8px;
      position: absolute;
      left: 4px;
      top: 0;
      bottom: 0;
      &-dot {
        position: absolute;
        width: 8px;
        height: 8px;
        top: 24px;
        left: 0;
        background: #ffffff;
        // border:1px solid #D8D8D8;;
        &:before {
          content: "";
          position: absolute;
          left: 2px;
          top: 2px;
          width: 4px;
          height: 4px;
          display: block;
          border-radius: 2px;
          background-color: #d8d8d8;
        }
        &.big-news {
          position: absolute;
          width: 4px;
          height: 4px;
          top: 24px;
          left: 2px;
          background: #fff;
          border-radius: 2px;
          border: 1px solid @mainColorRed;
          z-index: 10;
          &:before {
            content: "";
            position: absolute;
            left: -2px;
            right: -2px;
            top: -2px;
            bottom: -2px;
            background: transparent;
            border: 2px solid rgba(230, 57, 77, 0.15);
            border-radius: 4px;
            z-index: 1;
          }
        }
      }
      &-line {
        position: absolute;
        top: 0px;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(
          to bottom,
          @border-color-dark 60%,
          #fff 40%
        );
        background-position: top;
        background-size: 1px 6px;
        background-repeat: repeat-y;
      }
    }
  }
  @media screen and (max-width: 1280px) {
    .ban-news-item-timeline {
      position: relative;
      flex: 0 0 20px;
      &-time {
        display: none;
      }
    }
  }
  &-main {
    display: flex;
    flex: 1 1 80%;
    .ban-news-item-container {
      padding: 0 16px 12px 0;
      border-bottom: 1px solid @border-color-light;
      flex: 1 1 0%;
      flex-direction: column;
      display: flex;
      &-time {
        display: none;
      }
      &-info {
        flex: 0 1 auto;
        display: block;
      }
      .ban-news-item-title {
        font-size: 14px;
        color: #333333;
        padding-top: 16px;
        line-height: 22px;
        a {
          // color:@fc-primary;
          cursor: default;
          font-size: 14px;
          color: #333333;
          line-height: 22px;
        }
        &.big-news {
          color: @mainColorRed;
          a {
            color: @mainColorRed;
          }
        }
      }
      .ban-news-item-detail {
        padding-top: 10px;
        display: flex;
        position: relative;
        &-summary {
          flex: 1;
          color: @fc-gray;
          font-size: 13px;
          color: #666666;
          letter-spacing: 0;
          line-height: 20px;
          flex: 1 1 0%;
          background: transparent;
          padding-right: 0;
          display: block;
          word-wrap: break-word;
        }
      }
      .ban-news-item-image {
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
    @media screen and (max-width: 1280px) {
      .ban-news-item-container {
        position: relative;
        //
        &-time {
          flex: 0 0 20px;
          display: block;
        }
      }
    }
  }

  &-intro {
    display: block;
    .stock-group{
      padding-top: 10px;
    }
    .theme-group{
      padding-top: 10px;
    }
    &-topic {
      display: inline-block;
      font-size: 12px;
      border: 1px solid #4c5466;
      color: #4c5466;
      background: #fff;
      line-height: 12px;
      padding: 4px;
      margin-right: 12px;
      vertical-align: top;
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
  &:last-child .ban-news-item-timeline-indicator-line {
    bottom: 16px;
  }
  // .ban-news-item-dayfirst-line{
  //   position: absolute;
  //   bottom: 30px;
  //   left: 0;
  //   right: 0;
  //   height: 1px;
  //   background: @border-color-light;
  // }
  &:first-child .ban-news-item-timeline-indicator-line {
    top: 14px;
  }
}
@media screen and (max-width: 1280px) {
  .ban-news-item-timeline {
    &-indicator-dot {
      top: 16px;
    }
  }
  .ban-news-item-main {
    flex: 1 0 80%;
    .ban-news-item-container {
      position: relative;
      //
      &-time {
        flex: 0 0 20px;
        display: block;
        font-size: 14px;
        color: #666666;
        line-height: 18px;
        padding-top: 12px;
      }
      &-info {
        .ban-news-item-title {
          padding-top: 5px;
        }
      }
    }
  }
}
.dark {
  .ban-news-item {
    background: @dingDarkThird;
  }
  .ban-news-item-main .ban-news-item-container .ban-news-item-title {
    color: #fff;
    &.big-news{
      color: #e6394d;
      a{
        color: #e6394d;
      }
    }
    a {
      color: #fff;
    }
  }
  .ban-news-item-main .ban-news-item-container .ban-news-item-detail-summary {
    color: @dingFcDark;
  }
  .ban-news-item-intro-topic {
    border: 1px solid @dingDarkSec;
    color: #999;
    background: #363a47;
    &:hover {
      border: 1px solid #4f5466;
      color: #fff;
      background: #4f5466;
    }
  }
  .ban-news-item-main .ban-news-item-container{
    border-bottom:1px solid @dingDarkSec;
  }
  .ban-news-item-timeline-time{
    color: @dingFcDark;
    &.big-news{
      color: #e6394d;
    }
  }
  .ban-news-item-timeline-indicator-line{
    background-image: linear-gradient(to bottom, @dingDarkSec 60%, #363a47 40%);
  }
  .ban-news-item-timeline-indicator-dot{
    background: #363a47;
  }
  @media screen and (max-width: 1280px) {
    .ban-news-item-main .ban-news-item-container-time{
      color:@dingFcDark;
    }
  }
}
</style>
