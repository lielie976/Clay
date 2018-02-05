<template>
  <div class="zhuti-chart">
    <div class="zhuti-chart-graph">
      <div class="zhuti-chart-graph-tab">
        <div class="zhuti-chart-graph-tab-list">
          <template v-for="item in tabItems">
            <span @click="swapChartTab(item)" :class="{active:item.selected}" class="zhuti-chart-graph-tab-list-item" :key="item.target" v-if="item.active">{{item.text}}</span>
          </template>
        </div>
        <div class="zhuti-chart-graph-tab-date">
          <span class="zhuti-chart-graph-tab-date-item"><i class="iconfont">&#xe638;</i> 前一天</span>
          <span class="zhuti-chart-graph-tab-date-item">后一天 <i class="iconfont">&#xe634;</i></span>
        </div>
      </div>
      <div class="zhuti-chart-graph-main">
        <div class="fenshi">
          <div class="fenshi-title">
            <span class="fenshi-title-time">{{dateFormatter(now, 'YYYY-MM-DD HH:mm:ss')}}</span>
            <span class="fenshi-title-price">当前价</span>
          </div>
          <div class="fenshi-choose">
            <template v-if="fenshiData && fenshiData.length" >
              <stock-watch-item @enterStock="enterStock" @leaveStock="leaveStock" :key="`fenshi`+item.symbol" :item="item" v-for="item in fenshiData" />
              <i @click="addStock" class="choose-icon iconfont">&#xe6cc;</i>
            </template>
          </div>
          <fenshi :hasHovered="hasHovered" :chartMode="chartMode" :fenshiData="fenshiData" />
        </div>
      </div>
    </div>
    <div class="zhuti-chart-msg">
    </div>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import stockWatchItem from './stockWatchItem.vue'
import fenshi from './fenshi.vue'

export default {
  data () {
    return {
      tabItems: [
        {
          text: '分时',
          active: true,
          target: 'fenshi',
          selected: true
        },
        {
          text: '历史走势',
          active: true,
          target: 'lishi',
          selected: false
        },
        {
          text: '叠加走势',
          active: false,
          target: 'diejia',
          selected: false
        }
      ],
      now: new Date(),
      chosenFenshi: [{
        name: '沪深300',
        symbol: '000300.SS',
        hover: false,
        px: 0.6
      }],
      hasHovered: false,
      chartMode: 'fenshi',
      fenshiData: [{
        name: '沪深300',
        symbol: '000300.SS',
        hover: false,
        px: 0.6
      }],
      highlight: 1
    };
  },
  mixins: [shareMethodMixin],
  components: {
    stockWatchItem,
    fenshi
  },
  mounted () {
    setTimeout(() => {
      this.fenshiData = this.chosenFenshi
    }, 10);
  },
  methods: {
    swapChartTab (item) {
      if (item.selected) return
      this.tabItems = this.tabItems.map(i => {
        i.selected = (i.target === item.target)
        return i
      })
      this.chartMode = item.target
    },
    enterStock (item) {
      item.hover = true
      this.hasHovered = item.symbol
    },
    leaveStock (item) {
      item.hover = false
      this.hasHovered = false
    },
    addStock () {
      let data = [{
        name: '沪深300',
        symbol: '000300.SS',
        hover: false,
        px: 0.6
      },
      {
        name: '中核科技',
        symbol: '000777.SZ',
        hover: false,
        px: 0.6
      },
      {
        name: '乐视网',
        symbol: '300104.SZ',
        hover: false,
        px: 0.6
      },
      {
        name: '万达信息',
        symbol: '300168.SZ',
        hover: false,
        px: 0.6
      }]
      let length = this.fenshiData.length
      if (length < data.length) {
        this.fenshiData = data.slice(0, length + 1)
      } else {
        this.fenshiData = data.slice(0, 1)
      }
    }
  }
};
</script>

<style lang="less">
.zhuti-chart {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  height: 500px;
  background: #fff;
  &-graph {
    width: 840px;
    border-right: 1px solid #F0F0F0;
    &-tab {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #F0F0F0;
      display: flex;
      justify-content: space-between;
      &-list{
        width: 50%;
        &-item{
          line-height: 40px;
          font-size: 16px;
          display: inline-block;
          height: 40px;
          width: 64px;
          color: #999999;
          text-align: center;
          margin: 0 5px;
          cursor: pointer;
          &.active{
            color: #333333;
            border-bottom: 2px solid #E6394D;
          }
          &:hover{
            color: #333333;
            border-bottom: 2px solid #E6394D;
          }
        }
      }
      &-date{
        line-height: 40px;
        &-item{
          padding: 0 20px;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
        }
      }
    }
    &-main{
      .fenshi{
        &-title{
          height: 32px;
          line-height: 32px;
          &-time{
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            margin-right: 24px;
          }
          &-price{
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
          }
        }
        &-choose{
          .choose-icon{
            font-size: 18px;
            color: #333333;
            display:inline-block;
            margin-left: 12px;
            cursor: pointer;
          }
        }
      }
    }
  }
  &-msg {
    width: 360px;
  }
}
</style>
