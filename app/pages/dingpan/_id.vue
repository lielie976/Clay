<template>
  <div  :class="pageMode" class="ban dark">
    <div class="ban-main">
      <stock-summary-chart @change-date="dateChange" :selectDate="selectDate" />
      <ding-table v-if="show" @showGuide="showGuide" :svgWidth="svgWidth" :svgHeight="svgHeight" ref="tab" :selectDate="selectDate" :smallScreen="smallScreen" :yscrollVal="yscrollVal" :pageIndex="pageIndex" @swapTab="swapTab" :topFixed="topFixed" :tabItems="tabItems"/>
    </div>
    <div :style="{'width':sideWidth}" v-show="pageMode == 'normal'" class="ban-sidebar fixed">
      <ban-news :isDark="true"/>
      <ban-change :isDark="true"/>
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
export default {
  async asyncData ({ store, params, req }) {
    await store.dispatch('stockSummary/initSummary', '');
    return {
      pageIndex: params.id,
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
      title: ``,
      meta: [
        {
          hid: `description`,
          name: 'description',
          content: ``
        }
      ]
    }
  },
  methods: {
    init () {
      // this.tabOffsetTop = this.getElementTop(this.$refs.tab);
      const { dispatch } = this.$store
      dispatch('external/getBaiduTTSToken')
      this.addClass(document.body, 'dark');
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
      this.timer = setInterval(() => {
        this.$store.dispatch('stockSummary/initSummary', d);
      }, 20000)
    },
    stopInterval () {
      clearInterval(this.timer)
    },
    showGuide () {
      this.guideShow = true;
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
body{
  background:#292c33;
}
</style>
