
<template>
<div class="ban-change-item" >
 <div class="ban-change-item-timeline">
	  <div class="ban-change-item-timeline-indicator">
      <div class="ban-change-item-timeline-indicator-line"></div>
      <div  class="ban-change-item-timeline-indicator-dot"></div>
    </div>
    <div class="ban-change-item-timeline-time ">
      {{timeFormatter(item.timestamp, 'HH:mm:ss')}}
    </div>
  </div>
  <div class="ban-change-item-main">
    <div class="ban-change-item-container">
      <div  class="ban-change-item-container-time ">
      {{timeFormatter(item.timestamp, 'HH:mm:ss')}}
    </div>
    <!-- 个股异动 -->
      <div v-if="item.type <100" class="ban-change-item-container-info">
        <div class="ban-change-item-title ">
         <div class="ban-change-item-title-stock" >
           <div class="ban-change-item-title-stock-main">
             <a target="_blank" :href="`/stock/${item.object_id}`" @mouseenter="hoverStockName" @mouseleave="leaveStockName" class="ban-change-item-title-stock-main-name">
               <p class="ban-change-item-title-stock-main-name-text">{{item.object_name}}</p>
               <p class="ban-change-item-title-stock-main-name-symbol">{{symbolFilter(item.object_id)}}</p>
               <div class="ban-change-item-title-stock-main-name-svg" v-if="hovered">
                <svg v-if="lastStockDot && stockLine && shadowPolygon" xmlns="http://www.w3.org/2000/svg" class="stock-svg" ref='stockSvg' viewBox="0 0 150 80" :width="150" :height="80">
                <!-- <defs>
                  <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="MyGradient">
                    <stop offset="0%" stop-color="rgb(20,120,240)" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="rgb(20,120,240)" stop-opacity="0.01"/>
                  </linearGradient>
                </defs> -->
                <polyline  class="path" fill="none" stroke=" #1478F0" :stroke-width="1" :points="stockLine" />
                <!-- <polygon  class="polyline-shadow" fill="url(#MyGradient)" :points="shadowPolygon" /> -->
                <circle  :cx="lastStockDot[0]" :cy="lastStockDot[1]" r="10" fill="#1B6ED3" fill-opacity="0.2" />
                <circle  :cx="lastStockDot[0]" :cy="lastStockDot[1]" r="5" fill="#1B6ED3" fill-opacity="1" />
                </svg>
               </div>
             </a>
             <!-- <div>火箭</div> -->
           </div>
           <div v-if="item.detail" :class="color(item.detail.pcp)" class="ban-change-item-title-stock-rate">
             {{changeRate(item.detail.pcp)}}
           </div>
           <div :class="typeColor(item.type)"  class="ban-change-item-title-stock-desc">
             {{item.content}}
           </div>
         </div>
        </div>
        <div :class="{'expand':themelistMore&&!themelistExpand,'hide':themelistMore&&themelistExpand}"  ref="themelist"  v-if="adjustItem.detail && adjustItem.detail.plates && adjustItem.detail.plates.length" class="ban-change-item-detail-stock">
          <a  :class="color(t.pcp_core)" target="_blank" :href="`/theme/`+t.plate_id" :key="t.plate_id" v-for="t in adjustItem.detail.plates" class="ban-change-item-detail-stock-topic">
            <div class="ban-change-item-detail-stock-topic-name">{{t.plate_name}}</div>
            <div>{{changeRate(t.pcp_core)}}</div>
          </a>
          <i @click="expandTheme" v-if="themelistMore&&!themelistExpand" class="iconfont expandIcon">&#xe6d4;</i>
        </div>
      </div>
      <!-- 板块异动 -->
      <div v-if="item.type >= 100" class="ban-change-item-container-info">
        <div class="ban-change-item-title ">
         <div class="ban-change-item-title-theme" >
           <div  class="ban-change-item-title-theme-main">
             <a  v-if="item.detail" target="_blank" :href="`/theme/`+item.object_id" :class="colorFlag(item.detail.pcp_core)" class="ban-change-item-title-theme-main-name" >
               <p :aria-label="item.object_name" class="hint--bottom">{{item.object_name | nameFilter}}</p>
             </a>
           </div>
           <div v-if="item.detail" :class="color(item.detail.pcp_core)" class="ban-change-item-title-theme-rate">
             {{changeRate(item.detail.pcp_core)}}
           </div>
           <div :class="typeColor(item.type)" class="ban-change-item-title-theme-desc">
             {{item.content}}
           </div>
         </div>
        </div>
         <div  class="ban-change-item-detail-theme" v-if="item.detail && item.detail.cores && item.detail.cores.length">
          <a class="ban-change-item-detail-theme-item" :key="stock.code" target="_blank" :href="`/stock/`+stock.code"  v-for="(stock,index) in item.detail.cores" >
          <span  class="ban-change-item-detail-theme-item-name">
           <i v-if="index == 0" class="iconfont">&#xe640;</i><i v-if="index == 1" class="iconfont">&#xe641;</i><i  v-if="index == 2" class="iconfont">&#xe63f;</i> {{stock.symbol}}</span>

          <span :class="color(stock.pcr)"  class="ban-change-item-detail-theme-item-pcr" v-if="stock.pcr"><span class="normal">涨速</span>{{changeRate(stock.pcr)}}
          <img class="ban-change-item-detail-theme-item-pcr-img" src="/rise.png" v-if="stock.pcr>0"/>
            <img class="cban-change-item-detail-theme-item-pcr-img" src="/down.png" v-if="stock.pcr<0"/></span>
          <span :class="color(stock.pcp)"  class="ban-change-item-detail-theme-item-pcp" v-if="stock.pcp || 0==stock.pcp">{{changeRate(stock.pcp)}}</span>
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
import { fetchStockTrend } from "~/api/theme";
export default {
  props: ["item"],
  data() {
    return {
      upIds: [1, 2, 7, 8, 9, 10, 11, 100, 101],
      themelistMore: false,
      themelistExpand: false,
      hovered: false,
      stockTrend: null,
      stockLine: null,
      shadowPolygon: null,
      lastStockDot:null
    };
  },
  mixins: [shareMethodMixin],
  mounted() {
    this.$nextTick(() => {
      if (this.$refs["themelist"]) {
        if (
          this.$refs["themelist"].clientHeight &&
          this.$refs["themelist"].clientHeight > 50
        ) {
          this.themelistMore = true;
          this.themelistExpand = false;
        }
      }
    });
  },
  computed: {
    isBigNews() {
      return this.item.SubjIds.indexOf("10") > -1;
    },
    adjustItem() {
      if (this.item.type >= 100) {
        return this.item;
      } else {
        let i = JSON.parse(JSON.stringify(this.item));
        if (i.detail && i.detail.plates && i.detail.plates.length) {
          i.detail.plates = i.detail.plates.sort((a, b) => {
            return b.pcp_core - a.pcp_core;
          });
        }
        return i;
      }
    }
  },

  methods: {
    typeColor(n) {
      return (
        "-market-color--" + (this.upIds.indexOf(n) != -1 ? "red" : "green")
      );
    },
    expandTheme() {
      this.themelistExpand = true;
    },
    hoverStockName() {
      this.hovered = true;
      fetchStockTrend(this.item.object_id).then(res => {
        let d = this.dataBeautifySpecial(res.data.data.trend);
        this.stockTrend = d[this.item.object_id];
        this.drawStockTrend();
      });
    },
    drawStockTrend() {
      let maxPrice = 0,
        minPrice = 1000,
        maxTime = 0,
        minTime = 0;
      if (!this.stockTrend || !this.stockTrend.length) return;
      this.stockTrend.map(item => {
        maxPrice = item.last_px > maxPrice ? item.last_px : maxPrice;
        minPrice = item.last_px < minPrice ? item.last_px : minPrice;
        maxTime = item.timestamp > maxTime ? item.timestamp : maxTime;
        minTime = item.timestamp < minTime ? item.timestamp : minTime;
      });
      // let origin = this.tipOrigin(this.selectedStock);
      // if (!origin) return;
      let minY = 10;
      let maxY = 70;
      let minX = 10;
      let maxX = 140;
      let factorX = (maxX - minX) / this.stockTrend.length;
      let factorY =
        (maxY - minY) / (maxPrice - minPrice ? maxPrice - minPrice : maxPrice);
      let modX = Math.floor(this.stockTrend.length / (maxX - minX)) + 1; //对X轴进行优化 防止数据过多时对于一个x值进行多个y的绘制显得线很粗
      let pointList = this.stockTrend
        .map((v, i) => [
          factorX * i + minX,
          minY + factorY * (maxPrice - v.last_px)
        ])
        .filter((v, i) => !(i % modX));
      this.lastStockDot = pointList[pointList.length - 1];
      this.stockLine = pointList.map(i => i.join(",")).join(" ");
      // console.log(this.stockLine);
      this.shadowPolygon = [[minX, maxY]]
        .concat(pointList)
        .concat([[maxX, maxY]])
        .map(i => i.join(","))
        .join(" ");
    },
    leaveStockName() {
      this.hovered = false;
    }
  },
  filters: {
    nameFilter(n) {
      return n.length > 5 ? n.slice(0, 5) + "..." : n;
    }
  }
};
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.ban-change-item {
  display: flex;
  // flex-direction: column;
  position: relative;
  width: 100%;
  background: #fafafa;
  &-timeline {
    position: relative;
    flex: 0 0 72px;

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
      padding-left: 16px;
      padding-top: 16px;
      font-size: 12px;
      color: @dingFcDark;
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
        background: #fff;
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
          top: 12px;
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
    .ban-change-item-timeline {
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
    .ban-change-item-container {
      padding: 0 0 16px 0;
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
      .ban-change-item-title {
        font-size: 14px;
        color: #333333;
        padding-top: 16px;
        line-height: 22px;
        &-stock {
          display: flex;
          height: 40px;
          &-main {
            flex: 0 0 40%;
            display: flex;
            &-name {
              font-size: 14px;
              position: relative;
              overflow: visible;
              cursor: pointer;
              z-index: 20;
              &-svg {
                display: block;
                position: absolute;
                z-index: 50;
                left: 60px;
                top: 0;
                background: #3f4352;
              }
              &-text{
                color: #fff;
              }
              &-symbol {
                font-size: 12px;
                color: #999999;
              }
            }
          }
          &-rate {
            flex: 0 0 25%;
            text-align: center;
          }
          &-desc {
            flex: 0 0 35%;
            text-align: right;
          }
        }
        &-theme {
          display: flex;
          height: 52px;
          &-main {
            flex: 0 0 40%;
            position: relative;
            // max-width: 45%;
            &-name {
              color: #333;
              // text-overflow: ellipsis;
              // white-space:nowrap !important;
              // display: block;
              // max-width: 100%;
              p {
                padding: 9px 16px;
                border: 1px solid #333333;
                display: inline-block;
                font-size: 14px;
                color: #333333;
                letter-spacing: 0;
                // max-width: 100%;
                // text-overflow: ellipsis;
                // overflow: hidden;
                line-height: 14px;
                // white-space:nowrap !important;
                cursor: pointer;
              }
              &.-market-color-flag--red {
                p {
                  border: 1px solid @dingRise;
                  &:hover {
                    color: #fff;
                    background: @dingRise;
                  }
                }
              }
              &.-market-color-flag--green {
                p {
                  border: 1px solid @dingDown;
                  &:hover {
                    color: #fff;
                    background: @dingDown;
                  }
                }
              }
            }
          }
          &-rate {
            flex: 0 0 25%;
            text-align: center;
            line-height: 32px;
          }
          &-desc {
            flex: 0 0 35%;
            text-align: right;
            line-height: 32px;
          }
        }
      }
      .ban-change-item-detail {
        &-theme {
          display: block;
          &-item {
            display: flex;
            color: #999;
            padding: 5px;

            &-name {
              font-size: 13px;
              color: #999;
              line-height: 14px;
              flex-basis: 35%;
              .iconfont {
                color: #515566;
                margin-right: 2px;
              }
              &.-market-color-flag--red {
                color: #999 !important;
                &:hover {
                  color: @dingRise !important;
                }
              }
              &.-market-color-flag--green {
                color: #999 !important;
                &:hover {
                  color: @dingDown !important;
                }
              }
            }
            &-pcp {
              font-size: 14px;
              line-height: 16px;
              flex-basis: 25%;
              text-align: right;
            }
            &-pcr {
              .normal {
                font-size: 12px;
                color: #999999;
                line-height: 12px;
                padding-right: 2px;
              }
              font-size: 12px;
              line-height: 16px;
              flex-basis: 40%;
              text-align: center;
              &-img{
                width: 8px;
                height: 14px;
                margin-left: 4px;
                line-height: 18px;
                display: inline-block;
                position: relative;
                top: 3px;
              }
            }
          }
        }
        &-stock {
          // max-height: 48px;
          display: block;
          padding-right: 28px;
          position: relative;
          overflow-y: hidden;
          &.expand {
            max-height: 52px;
            // &:after{
            //   content:"\e6d4";
            //   font-family:'iconfont';
            //   position: absolute;
            //   right: 0;
            //   color:#999;
            //   top: 16px;
            //   height: 24px;
            //   width:24px;
            // }
            .expandIcon {
              position: absolute;
              right: 0;
              color: #999;
              cursor: pointer;
              top: 16px;
              height: 24px;
              width: 24px;
            }
          }
          &.hide {
            max-height: none;
          }
          &-topic {
            display: inline-block;
            font-size: 12px;
            border: 1px solid #4c5466;
            color: #4c5466;
            background: #fff;
            line-height: 12px;
            margin-top: 10px;
            padding: 4px 12px;
            margin-right: 12px;
            vertical-align: top;
            text-align: center;
            cursor: pointer;
            &-name {
              color: #999;
              padding-bottom: 4px;
            }
            &.-market-color--red {
              &:hover {
                color: #fff !important;
                background: @dingRise;
                .ban-change-item-detail-stock-topic-name {
                  color: #fff !important;
                }
              }
            }
            &.-market-color--green {
              // border: 1px solid @dingDown;

              &:hover {
                color: #fff !important;
                background: @dingDown;
                .ban-change-item-detail-stock-topic-name {
                  color: #fff !important;
                }
              }
            }
          }
        }
      }
      .ban-change-item-image {
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
  @media screen and (max-width: 1280px) {
    .ban-change-item-timeline {
      &-indicator-dot {
        top: 16px;
      }
    }
    .ban-change-item-main {
      flex: 1 0 80%;
      .ban-change-item-container {
        position: relative;
        //
        &-time {
          flex: 0 0 20px;
          display: block;
          font-size: 14px;
          color: #999;
          line-height: 18px;
          padding-top: 12px;
        }
        &-info {
          .ban-change-item-title {
            padding-top: 5px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1440px) {
    .ban-change-item-main
      .ban-change-item-container
      .ban-change-item-title-theme-main-name
      p {
      padding: 9px;
      font-size: 12px;
    }
  }

  &:last-child .ban-change-item-timeline-indicator-line {
    bottom: 16px;
  }
  // .ban-change-item-dayfirst-line{
  //   position: absolute;
  //   bottom: 30px;
  //   left: 0;
  //   right: 0;
  //   height: 1px;
  //   background: @border-color-light;
  // }
  &:first-child .ban-change-item-timeline-indicator-line {
    top: 14px;
  }
}
.dark {
  .ban-change-item {
    background: @dingDarkThird;
  }
  .ban-change-item-main
    .ban-change-item-container
    .ban-change-item-title-theme-main-name
    p {
    color: #fff;
  }
  .ban-change-item-main .ban-change-item-container .ban-change-item-title {
    color: #fff;
  }
  .ban-change-item-main
    .ban-change-item-container
    .ban-change-item-detail-stock-topic {
    border: 1px solid @dingDarkSec;
    color: #999;
    background: @dingDarkThird;
    &.-market-color--red {
      // border: 1px solid @dingRise;
      &:hover {
        color: #fff !important;
        border: 1px solid @dingRise;
        background: @dingRise;
      }
    }
    &.-market-color--green {
      // border: 1px solid @dingDown;
      &:hover {
        color: #fff !important;
        border: 1px solid @dingDown;
        background: @dingDown;
      }
    }
  }
  .ban-change-item-timeline-indicator-line {
    background-image: linear-gradient(to bottom, @dingDarkSec 60%, @dingDarkThird 40%);
  }
  .ban-change-item-timeline-indicator-dot {
    background: @dingDarkThird;
  }
  .ban-change-item-main .ban-change-item-container {
    border-bottom: 1px solid @dingDarkSec;
  }
}
</style>
