<template>
  <div class="zhuti-chart">
    <div class="zhuti-chart-graph">
      <div class="zhuti-chart-graph-tab">
        <div class="zhuti-chart-graph-tab-list">
          <template v-for="item in tabItems">
            <span @click="swapChartTab(item)" :class="{active:item.selected}" class="zhuti-chart-graph-tab-list-item" :key="item.target" v-if="item.active">{{item.text}}</span>
          </template>
        </div>
        <div v-if="chartMode == 'fenshi'" class="zhuti-chart-graph-tab-date">
          <span class="zhuti-chart-graph-tab-date-item"><i class="iconfont">&#xe638;</i> 前一天</span>
          <span class="zhuti-chart-graph-tab-date-item">后一天 <i class="iconfont">&#xe634;</i></span>
        </div>
        <div v-if="chartMode == 'lishi'" class="zhuti-chart-graph-tab-tongji">
          <span @click="clickTongji" class="zhuti-chart-graph-tab-tongji-item"><i v-if="!startTongjiDrag" class="iconfont">&#xe608;</i><i v-else class="iconfont">&#xe610;</i> 区间统计</span>
        </div>
      </div>
      <div class="zhuti-chart-graph-main">
        <div class="fenshi">
          <div class="fenshi-title">
            <span class="fenshi-title-time">{{dateFormatter(now, 'YYYY-MM-DD HH:mm:ss')}}</span>
            <!-- <span class="fenshi-title-price">当前价</span> -->
          </div>
          <div class="fenshi-choose">
            <template v-if="chartMode == 'fenshi'&& chartDiejia.fenshi && chartDiejia.fenshi.length" >
              <stock-watch-item @enterStock="enterStock" @leaveStock="leaveStock" :key="`fenshi`+item.symbol" :item="item" v-for="item in chartDiejia.fenshi" />
              <!-- <i @click="addStock" class="choose-icon iconfont">&#xe6cc;</i> -->
            </template>
             <template v-if="chartMode == 'lishi'&& chartDiejia.lishi && chartDiejia.lishi.length" >
              <stock-watch-item @enterStock="enterStock" @leaveStock="leaveStock" :key="`fenshi`+item.symbol" :item="item" v-for="item in chartDiejia.lishi" />
              <!-- <i @click="addStock" class="choose-icon iconfont">&#xe6cc;</i> -->
            </template>
             <template v-if="chartMode == 'fenxi' && chartDiejia.fenxi && chartDiejia.fenxi.length" >
              <stock-watch-item @enterStock="enterStock" @leaveStock="leaveStock" :key="`fenshi`+item.symbol" :item="item" v-for="item in chartDiejia.fenxi" />
              <!-- <i @click="addStock" class="choose-icon iconfont">&#xe6cc;</i> -->
            </template>
          </div>
          <fenshi :id="id" :fenxiStock="chartDiejia.fenxi" @switch-analyse="goAnalyse" :lishiStock="chartDiejia.lishi" @drag-selected="dragSelected" :startTongjiDrag="startTongjiDrag" :hasHovered="hasHovered" :chartMode="chartMode" :fenshiData="chartDiejia.fenshi" />
        </div>
      </div>
    </div>
    <div class="zhuti-chart-event">
      <zhuti-event />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
import shareMethodMixin from '~/mixins/shareMethodMixin'
import stockWatchItem from './stockWatchItem.vue'
import fenshi from './fenshi.vue'
import zhutiEvent from './zhutiEvent.vue'

export default {
  props: ['id'],
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
          text: '区间统计',
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
      fenshiData: [{
        name: '沪深300',
        symbol: '000300.SS',
        hover: false,
        px: 0.6
      }],
      chartDiejia: {
        fenshi: [],
        lishi: [],
        fenxi: []
      },
      lishiStock: [],
      fenxiStock: [],
      startTongjiDrag: false,
      highlight: 1
    };
  },
  computed: {
    zhutiInfo () {
      return {
        name: '主题',
        symbol: this.id,
        hover: false,
        px: 0.6
      }
    },
    diejia () {
      return this.$store.state.zhutiChart.diejia
    },
    _fenshi () {
      return this.$store.state.zhutiChart.diejia.fenshi
    },
    _lishi () {
      return this.$store.state.zhutiChart.diejia.lishi
    },
    _fenxi () {
      return this.$store.state.zhutiChart.diejia.fenxi
    },
    chartMode () {
      return this.$store.state.zhutiChart.mode
    }
  },
  mixins: [shareMethodMixin],
  components: {
    stockWatchItem,
    fenshi,
    zhutiEvent
  },
  watch: {
    _fenshi: {
      deep: true,
      handler: function (v) {
        if (this.chartMode === 'fenshi') {
          let d = v.filter(i => i.checked)
          if (!d.length) {
            this.chartDiejia[this.chartMode] = [{
              name: '沪深300',
              symbol: '000300.SS',
              hover: false,
              px: 0.6,
              _index: 0
            }]
          } else {
            this.chartDiejia[this.chartMode] = d.map(i => {
              i.symbol = i.Symbol
              i.name = i.Name
              i.hover = false
              return i
            }).sort((a, b) => a._index - b._index)
          }
        }
      }
    },
    _lishi: {
      deep: true,
      handler: function (v) {
        if (this.chartMode === 'lishi') {
          let d = v.filter(i => i.checked)
          debugger
          if (!d.length) {
            this.chartDiejia[this.chartMode] = [{
              name: '沪深300',
              symbol: '000300.SS',
              hover: false,
              px: 0.6,
              _index: 0
            }]
          } else {
            this.chartDiejia[this.chartMode] = d.map(i => {
              i.symbol = i.Symbol
              i.name = i.Name
              i.hover = false
              return i
            }).sort((a, b) => a._index - b._index)
          }
        }
      }
    },
    _fenxi: {
      deep: true,
      handler: function (v) {
        if (this.chartMode === 'fenxi') {
          let d = v.filter(i => i.checked)
          if (!d.length) {
            this.chartDiejia[this.chartMode] = [{
              name: '沪深300',
              symbol: '000300.SS',
              hover: false,
              px: 0.6,
              _index: 0
            }]
          } else {
            this.chartDiejia[this.chartMode] = d.map(i => {
              i.symbol = i.Symbol
              i.name = i.Name
              i.hover = false
              return i
            }).sort((a, b) => a._index - b._index)
          }
        }
      }
    },
    chartMode (v) {
      let d = this.diejia[v].filter(i => i.checked)
      if (!d.length && (v === 'fenxi' || v === 'fenshi')) {
        this.chartDiejia[v] = [{
          name: '沪深300',
          symbol: '000300.SS',
          hover: false,
          px: 0.6,
          _index: 0
        }]
      } else {
        this.chartDiejia[v] = d.map(i => {
          i.symbol = i.Symbol
          i.name = i.Name
          i.hover = false
          return i
        }).sort((a, b) => a._index - b._index)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.chartDiejia[this.chartMode] = [{
        name: '沪深300',
        symbol: '000300.SS',
        hover: false,
        px: 0.6,
        _index: 0
      }]
    }, 10);
  },
  methods: {
    swapChartTab (item) {
      if (item.selected) return
      this.startTongjiDrag = false
      this.tabItems = this.tabItems.map(i => {
        i.selected = (i.target === item.target)
        return i
      })
      this.$store.commit('zhutiChart/changeMode', item.target)
    },
    goAnalyse () {
      debugger
      this.$store.commit('zhutiChart/changeMode', 'fenxi')
      this.tabItems[0].active = false
      this.tabItems[1].active = false
      this.tabItems[2].active = true
    },
    clickTongji () {
      this.startTongjiDrag = !this.startTongjiDrag
    },
    enterStock (item) {
      item.hover = true
      this.hasHovered = item.symbol
    },
    leaveStock (item) {
      item.hover = false
      this.hasHovered = false
    },
    dragSelected (time) {
      this.startTongjiDrag = false
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
      if (this.chartMode === 'fenshi') {
        let length = this.fenshiData.length
        if (length < data.length) {
          this.fenshiData = data.slice(0, length + 1)
        } else {
          this.fenshiData = data.slice(0, 1)
        }
      }
      if (this.chartMode === 'fenxi') {
        let length = this.fenxiStock.length
        if (length < data.length) {
          this.fenxiStock = data.slice(0, length + 1)
        } else {
          this.fenxiStock = data.slice(0, 1)
        }
      }
      if (this.chartMode === 'lishi') {
        let length = this.lishiStock.length
        if (length < data.length) {
          this.lishiStock = data.slice(0, length + 1)
        } else {
          this.lishiStock = data.slice(0, 1)
        }
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
        cursor: pointer;
        &-item{
          padding: 0 20px;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
        }
      }
      &-tongji{
        cursor: pointer;
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
