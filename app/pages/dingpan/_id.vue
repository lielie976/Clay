<template>
  <div  :class="pageMode" class="ban dark">
    <div class="ban-main">
      <stock-summary-chart @change-date="dateChange" :selectDate="selectDate" />
      <ding-table :yidongtixing="yidongtixing" @changeYidong="changeYidong" v-if="show" @showGuide="showGuide" :svgWidth="svgWidth" :svgHeight="svgHeight" ref="tab" :selectDate="selectDate" :smallScreen="smallScreen" :yscrollVal="yscrollVal" :pageIndex="pageIndex" @swapTab="swapTab" :topFixed="topFixed" :tabItems="tabItems"/>
    </div>
    <div v-if="show" :style="{'width':sideWidth}" v-show="pageMode == 'normal'" class="ban-sidebar fixed">
      <ban-news :isDark="true"/>
      <ban-change :isDark="true"/>
    </div>
    <div v-if="guideShow" class="guide">
      <div class="guide-container">
        <img class="guide-container-logo" src="/img/logo_ding.png"/>
        <p class="guide-container-desc">“智能盯盘”是选股宝在业内最先推出的，基于个股行情变化和选股宝独家主题库数据，运用最先进的大数据+神经网络算法，实时监测盘面的板块异动，将看盘带入人工智能时代。</p>
        <p class="guide-container-desc">选股宝四维智能行情监控开创了A股“傻瓜式盯盘”时代的到来，给投资者带来全新的盯盘体验。</p>
        <p class="guide-container-desc">选股宝智能盯盘特色功能包括：</p>
        <img src="http://image.bao.wallstreetcn.com/ding/ding-guide.png"/>
      </div>
      <div class="guide-start">
        <div @click="closeGuide" class="guide-start-btn">立即使用</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-debugger, eqeqeq */
import stockSummaryChart from '~/views/dingpan/stockSummaryChart'
import dingTable from '~/views/dingpan/dingTable'
import banNews from '~/views/dingpan/slideBar/banNews'
import banChange from '~/views/dingpan/slideBar/banChange'
import shareMethodMixin from '~/mixins/shareMethodMixin'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store, params, req }) {
    return {
      pageIndex: params.id ? params.id : 0,
      pageMode: 'normal',
      sideWidth: '25%',
      selectDate: new Date(),
      timer: 0,
      topFixed: false,
      yscrollVal: 0,
      smallScreen: false,
      tabOffsetTop: 152,
      guideShow: false,
      svgWidth: 1000,
      svgHeight: 600,
      yidongtixing: true,
      show: false,
      stopRefreshing: false,
      tabItems: [
        {
          index: 0,
          text: '盯盘',
          type: 'ding',
          targetProp: '',
          poolPostfix: '',
          checked: false
        },
        {
          index: 1,
          text: '涨停池',
          type: 'boardstock',
          targetProp: 'last_raise_time',
          poolPostfix: 'board_code_desc',
          checked: false
        },
        {
          index: 2,
          text: '炸板池',
          type: 'boomstock',
          targetProp: 'last_boom_time',
          poolPostfix: 'boom_code_desc',
          checked: false
        },
        {
          index: 3,
          text: '新股池',
          type: 'newstock',
          targetProp: 'new_stock_rule',
          poolPostfix: 'new_code_desc',
          checked: false
        },
        {
          index: 4,
          text: '次新股池',
          type: 'secstock',
          targetProp: 'px_change_rate',
          poolPostfix: 'sec_code_desc',
          checked: false
        },
        {
          index: 5,
          text: '强势股池',
          type: 'multistock',
          targetProp: 'continue_board_count',
          poolPostfix: 'multi_code_desc',
          checked: false
        },
        {
          index: 6,
          text: '跌停池',
          type: 'downstock',
          targetProp: 'last_board_time',
          poolPostfix: '',
          checked: false
        },
        {
          index: 7,
          text: '昨日涨停池',
          type: 'boardpreday',
          targetProp: 'last_raise_time',
          poolPostfix: '',
          checked: false
        }
      ]
    }
  },
  head () {
    return {
      title: `${texts.slogan}`
    }
  },
  watch: {
    yidongtixing (v) {
      setTimeout(() => {
        if (v) {
          this.addClass(document.body, 'ban-special')
          localStorage.setItem('dingSimple', 0);
        } else {
          this.removeClass(document.body, 'ban-special')
          localStorage.setItem('dingSimple', 1);
        }
        this.pageMode = v ? 'normal' : 'simple';
      }, 100);
    }
  },
  beforeDestroy () {
    this.removeClass(document.body, 'dark');
    this.removeClass(document.body, 'ban-special');
  },
  methods: {
    async init () {
      // this.tabOffsetTop = this.getElementTop(this.$refs.tab);
      try {
        await this.$store.dispatch('stockSummary/initSummary', '').then()
      } catch (error) {
      }
      if (
        localStorage.getItem('dingSimple') &&
        localStorage.getItem('dingSimple') != 0
      ) {
        this.yidongtixing = false;
        localStorage.setItem('dingSimple', 1);
      } else {
        this.yidongtixing = true;
        localStorage.setItem('dingSimple', 0);
      }
      if (!localStorage.getItem('guideViewed')) {
        this.guideShow = true;
        localStorage.setItem('guideViewed', 1);
      }
      const { dispatch } = this.$store
      dispatch('external/getBaiduTTSToken')
      this.addClass(document.body, 'dark');
      this.addClass(document.body, 'ban-special');
      let innerWidth =
        document.documentElement.clientWidth ||
        document.body.clientWidth ||
        window.innerWidth;
      if (innerWidth < 1333) {
        this.sideWidth = innerWidth - 1000 + 'px';
        this.svgWidth = 1000 * 0.85;
        this.svgHeight = 1000 * 0.85 * 0.6;
      } else {
        if (this.yidongtixing) {
          this.sideWidth = '25%';
          this.svgWidth = innerWidth * 0.75 * 0.85;
          this.svgHeight = innerWidth * 0.75 * 0.85 * 0.6;
        } else {
          this.sideWidth = '25%';
          this.svgWidth = 1200 * 0.85;
          this.svgHeight = 1200 * 0.85 * 0.6;
        }
      }
      this.show = true
      this.$nextTick(() => {
        this.tabOffsetTop = this.getElementTop(this.$refs.tab.$refs.tab);
        window.addEventListener('scroll', this.onscroll, { passive: true });
        window.addEventListener('resize', this.handleResize);
      })
      this.tabItems[this.pageIndex].checked = true;
      this.onscroll = () => {
        let top = document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop;
        if (top >= this.tabOffsetTop) {
          this.topFixed = true;
          this.yscrollVal = top - this.tabOffsetTop;
        } else {
          this.topFixed = false;
        }
      };
      this.handleResize = () => {
        let innerWidth =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth;
        if (innerWidth < 1333) {
          this.sideWidth = innerWidth - 1000 + 'px';
          this.svgWidth = 1000 * 0.85;
          this.svgHeight = 1000 * 0.85 * 0.6;
        } else {
          if (this.yidongtixing) {
            this.sideWidth = '25%';
            this.svgWidth = innerWidth * 0.75 * 0.85;
            this.svgHeight = innerWidth * 0.75 * 0.85 * 0.6;
          } else {
            this.sideWidth = '25%';
            this.svgWidth = 1200 * 0.85;
            this.svgHeight = 1200 * 0.85 * 0.6;
          }
        }
        if (innerWidth < 1280) {
          this.smallScreen = true;
        } else {
          this.smallScreen = false;
        }
      };
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.stopRefreshing = false;
          this.startInterval();
          this.$refs.tab.startInterval();
        } else {
          this.stopRefreshing = true;
          this.stopInterval();
          this.$refs.tab.stopInterval()
        }
      });
    },
    changeYidong () {
      this.yidongtixing = !this.yidongtixing
    },
    dateChange (date) {
      this.selectDate = date;
      this.refresh()
    },
    refresh () {
      this.stopInterval()
      this.startInterval()
    },
    swapTab (item) {
      this.tabItems = this.tabItems.map(i => {
        i.checked = i.index == item.index
        this.pageIndex = item.index;
        return i;
      });
      if (
        isNaN(location.href.split('/')[location.href.split('/').length - 1])
      ) {
        history.pushState({}, '', '/dingpan/' + this.pageIndex);
      } else {
        history.pushState({}, '', this.pageIndex);
      }
      this.refresh()
    },
    startInterval () {
      let d =
        this.dateFormatter(this.selectDate, 'YYYYMMDD') === this.dateFormatter(new Date(), 'YYYYMMDD')
          ? null
          : this.dateFormatter(this.selectDate, 'YYYYMMDD');
      this.$store.dispatch('stockSummary/initSummary', d);
      this.timer = setInterval(() => {
        this.$store.dispatch('stockSummary/initSummary', d);
      }, 20000)
    },
    stopInterval () {
      clearInterval(this.timer)
    },
    showGuide () {
      this.guideShow = true;
    },
    closeGuide () {
      this.guideShow = false;
    }
  },
  mounted () {
    this.init()
  },
  components: {
    stockSummaryChart,
    dingTable,
    banNews,
    banChange
  },
  mixins: [shareMethodMixin]
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';
.ban {
  display: flex;
  width: 100%;
  min-width: 1280px;
  background:#292c33;
  min-height: 100vh;
  &-main {
    display: block;
    width: 75%;
    min-width: 1000px;
    // flex:1;
  }
  &.simple {
    .ban-main {
      width: 100%;
    }
  }
  &-chart-out {
    width: 100%;
    position: relative;
    background: @dingDarkMain;
    z-index: 20;
  }
}
</style>

<style lang="less">
@import '../../styles/variables.less';
.ban{
  &.normal {
      .ban-table-tab.fixed {
        max-width: auto;
        width: 75%;
      }
      .hit-pool__table.table.fixed {
        max-width: auto;
        width: 75%;
      }
    }
  &.simple {
    .ban-chart {
      width: 1200px;
      margin: 0 auto;
    }
    .ban-chart-out {
      width: 1200px;
      margin: 0 auto;
    }
    .ban-table-tab {
      width: 100%;
      .ban-table-tab-container {
        width: 1200px;
        margin: 0 auto;
        position: relative;
      }
    }
    .hit-pool__table.table.fixed {
      left: 50%;
      margin-left: -600px;
    }
    .ban-table-main {
      width: 1200px;
      margin: 0 auto;
      position: relative;
    }
    @media screen and (max-width: 1280px) {
      min-width: 1000px;
      .ban-chart {
        width: 1000px;
        margin: 0 auto;
      }
      .ban-table-tab {
        width: 100%;
        .ban-table-tab-container {
          width: 1000px;
          margin: 0 auto;
          position: relative;
        }
      }
      .hit-pool__table.table.fixed {
        left: 50%;
        margin-left: -500px;
      }
      .ban-table-main {
        width: 1000px;
        margin: 0 auto;
        position: relative;
      }
      .ban-chart-out {
        width: 1000px;
        margin: 0 auto;
      }
    }
  }
}
.guide {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: @dingDarkThird;
  overflow: scroll;
  &-container {
    width: 900px;
    margin: 0 auto;
    padding: 60px 0 0 0;
    // overflow: scroll;
    &-logo {
      position: relative;
      margin-bottom: 20px;
    }
    &-desc {
      font-size: 16px;
      color: #ffffff;
      letter-spacing: 0;
      line-height: 24px;
      margin-top: 20px;
    }
  }
  &-start {
    bottom: 0;
    height: 100px;
    position: fixed;
    left: 0;
    background: @dingDarkThird;
    right: 0;
    padding-top: 20px;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.15);
    &-btn {
      opacity: 0.8;
      background: #e6394d;
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 16px;
      line-height: 48px;
      text-align: center;
      margin: 0 auto;
      cursor: pointer;
      width: 240px;
      height: 48px;
    }
  }
}
</style>
