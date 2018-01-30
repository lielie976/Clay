<template>
  <div class="ban-table">
    <div ref="tab"  :class="{'fixed':topFixed}" class="ban-table-tab">
      <div class="ban-table-tab-container">
        <div class="ban-table-tab-items">
        <div @click="swapTab(item)" v-for="item in tabItems" :key="item.index" :target="item.index" class="ban-table-tab-item">
        <span :class="{'checked':item.checked}" class="tab-item-text">{{item.text}}</span>
      </div>
      </div>
      <div class="ban-table-tab-toolbar">
        <toolbar  @filterChange="filterChange" v-if="pageIndex!=0 && tableData && tableData.length" :index="pageIndex" :stock-list="tableData"/>
      </div>
      <a href="http://biaoge.wallstreetcn.com/f/O88l5G" target="_blank" class="ban-table-tab-advice">
        <i class="iconfont">&#xe64b;</i><span class="ban-table-tab-advice-btn">用户反馈</span>
      </a>
      <div class="ban-table-tab-option">
        <div @click="changeYidong" :class="{wantselect:!yidongtixing}" class="ban-table-tab-yidong">
          <i  class="iconfont">&#xe6c3;</i><span class="ban-table-tab-advice-btn">异动</span>
        </div>
      </div>
      </div>
    </div>
    <div v-if="topFixed" class="ban-table-tab-fake"></div>
    <div class="ban-table-main">
      <ding-chart :theme-map="themeMap" @guide='showGuide' :theme-pcr="themePcrRank" :v-width="svgWidth" :v-height="svgHeight" :is-dark="true" v-if="pageIndex == 0" :fluctuation="fluctuation" :dataList="dingStockList"  ></ding-chart>
      <board-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 1 && tableData && tableData.length" :stock-list="tableData"/>
      <boom-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 2 && tableData && tableData.length" :stock-list="tableData"/>
       <new-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 3 && tableData && tableData.length" :stock-list="tableData"/>
      <sec-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 4 && tableData && tableData.length" :stock-list="tableData"/>
      <multi-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 5 && tableData && tableData.length"  :stock-list="tableData"/>
      <board-down-stock :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 6 && tableData && tableData.length"  :stock-list="tableData"/>
     <board-preday :small="smallScreen" :y='yscrollVal' :top-fixed="topFixed" @sort="startSort" :sort-rule="sortRule" :sort-target="sortTarget" v-if="pageIndex == 7 && tableData && tableData.length"  :stock-list="tableData"/>
     <!--  <dot-spinner  v-if="loading"/> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable no-debugger, eqeqeq */
import { stockApi } from '~/api/stockApi'
import format from 'date-fns/format';
import shareMethodMixin from '~/mixins/shareMethodMixin'
import { getChart } from '~/api/wows'
import boardStock from './pools/boardStock.vue'
import boomStock from './pools/boomStock.vue'
import newStock from './pools/newStock.vue'
import secStock from './pools/secStock.vue'
import multiStock from './pools/multiStock.vue'
import toolbar from './toolbar.vue'
import boardPreday from './pools/boardPreday.vue'
import dingChart from './dingChart.vue'
import boardDownStock from './pools/boardDownStock.vue'
import { fetchThemePcrRank, fetchThemeInfo } from '~/api/theme'
export default {
  props: ['tabItems', 'topFixed', 'pageIndex', 'smallScreen', 'yscrollVal', 'selectDate', 'svgWidth', 'svgHeight', 'yidongtixing'],
  data () {
    return {
      tableData: [],
      loading: false,
      sortTarget: 'last_raise_time',
      sortRule: 'desc',
      guideShow: false,
      filterNewstock: true,
      timer: 0,
      themeMap: {},
      dingStockList: [],
      themePcrRank: []
    }
  },
  watch: {
    selectDate () {
      this.$nextTick(() => {
        this.stopInterval()
        this.startInterval()
      })
    }
  },
  mounted () {
    this.startInterval()
    this.loadThemeMap();
    setInterval(() => {
      this.loadThemeMap();
    }, 1200000);
    const Split = require('split.js');
    Split(['.ban-news', '.ban-change'], {
      sizes: [50, 50],
      direction: 'vertical',
      minSize: 40
    });
  },
  methods: {
    swapTab (item) {
      if (item.index != this.pageIndex) {
        this.tableData = []
        this.loading = true
        this.sortTarget = item.targetProp
        this.sortRule = 'default'
        this.$emit('swapTab', item)
        this.$nextTick(() => {
          this.stopInterval()
          this.startInterval()
        })
      }
    },
    startInterval () {
      this.getData()
      this.timer = setInterval(() => {
        this.getData()
      }, 10000)
    },
    showGuide () {
      this.$emit('showGuide')
    },
    stopInterval () {
      clearInterval(this.timer)
    },

    startSort (d) {
      this.sortRule = d.sortRule;
      this.sortTarget = d.sortTarget;
      if (this.$store.state.user.userInfo.Token) {
        this.tableData = this.sortData().map((item, index) => {
          item['index'] = index + 1;
          return item;
        });
      } else {
        this.tableData = this.sortData().map((item, index) => {
          item['index'] = index + 1;
          item.reason = '__lock';
          return item;
        });
      }
    },
    changeYidong () {
      this.$emit('changeYidong')
    },
    getData () {
      if (this.pageIndex != 0) {
        stockApi[this.tabItems[this.pageIndex].type](
          null,
          format(this.selectDate, 'YYYYMMDD') === format(new Date(), 'YYYYMMDD')
            ? null
            : format(this.selectDate, 'YYYYMMDD'),
          this.filterNewstock
        ).then(stockInfo => {
          this.originTableData = this.dataBeautify(
            stockInfo.data,
            'fields',
            'items'
          );
          if (this.$store.state.user.userInfo.Token) {
            this.tableData = this.sortData().map((item, index) => {
              item['index'] = index + 1;
              return item;
            });
          } else {
            this.tableData = this.sortData().map((item, index) => {
              item['index'] = index + 1;
              item.reason = '__lock';
              return item;
            });
          }
          this.firstLoaded++;
          this.loading = false;
          return Promise.resolve(1);
        });
      } else {
        if (this.inStockTime() || !this.dingStockList || !this.dingStockList.length) {
          Promise.all(
            [
              getChart(),
              fetchThemePcrRank()
            ]
          ).then(res => {
            let [ballChartData, themePcr] = res;
            this.themePcrRank = this.dataBeautify(
              themePcr.data,
              'fields',
              'items'
            );
            this.dingStockList = this.dataBeautify(
              ballChartData.data,
              'fields',
              'items'
            );
            this.firstLoaded++;
            this.loading = false;
            return Promise.resolve(1);
          });
        } else {
          this.loading = false;
          return Promise.resolve(1);
        }
      }
    },
    filterChange (v) {
      this.filterNewstock = v;
      this.stopInterval();
      this.startInterval();
    },
    sortData () {
      if (this.pageIndex == 3) {
        // 新股池特殊
        if (this.sortRule === 'default' || this.sortTarget === 'new_stock_rule') {
          // return this.originTableData
          // 特殊的排序
          let origin = JSON.parse(JSON.stringify(this.originTableData));
          // return origin.sort(function(a, b) {
          //   return b['bool_open_board'] - a['bool_open_board'] || (Number(b['turnover_ratio']) - Number(a['turnover_ratio'])) || b['px_change_rate'] - a['px_change_rate']
          // })
          return origin
            .filter(i => i.bool_open_board || Number(i['turnover_ratio']) >= 2)
            .sort((a, b) => {
              return (
                b['bool_open_board'] - a['bool_open_board'] ||
                Number(b['turnover_ratio']) - Number(a['turnover_ratio']) ||
                b['before_open_count'] - a['before_open_count']
              );
            })
            .concat(
              origin
                .filter(
                  i => !i.bool_open_board && Number(i['turnover_ratio']) < 2
                )
                .sort((a, b) => {
                  return b['before_open_count'] - a['before_open_count'];
                })
            );
        } else {
          let origin = JSON.parse(JSON.stringify(this.originTableData));
          return origin.sort((a, b) => {
            switch (this.sortRule) {
              case 'desc':
                return b[this.sortTarget] - a[this.sortTarget];
              default:
                return a[this.sortTarget] - b[this.sortTarget];
            }
          });
        }
      } else if (this.pageIndex == 4 && this.sortTarget === 'board_days') {
        if (this.sortRule === 'default') {
          return this.originTableData;
        } else {
          let origin = JSON.parse(JSON.stringify(this.originTableData));
          return origin.sort((a, b) => {
            switch (this.sortRule) {
              case 'desc':
                return (
                  b.board_days - a.board_days ||
                  (b.board_days === a.board_days &&
                    b.board_count / b.board_days - a.board_count / a.board_days)
                );
              default:
                return (
                  a.board_days - b.board_days ||
                  (b.board_days === a.board_days &&
                    a.board_count / a.board_days - b.board_count / b.board_days)
                );
            }
          });
        }
      } else if (
        this.pageIndex == 4 &&
        this.sortTarget === 'continue_board_count'
      ) {
        if (this.sortRule === 'default') {
          return this.originTableData;
        } else {
          let origin = JSON.parse(JSON.stringify(this.originTableData));
          return origin.sort((a, b) => {
            switch (this.sortRule) {
              case 'desc':
                return (
                  b.continue_board_count - a.continue_board_count ||
                  b.px_change_rate - a.px_change_rate
                );
              default:
                return (
                  a.continue_board_count - b.continue_board_count ||
                  a.px_change_rate - b.px_change_rate
                );
            }
          });
        }
      } else {
        if (this.sortRule === 'default') {
          return this.originTableData;
        } else {
          let origin = JSON.parse(JSON.stringify(this.originTableData));
          return origin.sort((a, b) => {
            switch (this.sortRule) {
              case 'desc':
                return b[this.sortTarget] - a[this.sortTarget];
              default:
                return a[this.sortTarget] - b[this.sortTarget];
            }
          });
        }
      }
    },
    loadThemeMap () {
      fetchThemeInfo('all', 'plate_id,stocks').then(
        res => {
          let bkjs = this.extractBkjsDetail(res.data);
          // let bkjs2= JSON.parse(JSON.stringify(bkjs))
          for (var bkjid in bkjs) {
            if (bkjs[bkjid] && bkjs[bkjid].stocks) {
              bkjs[bkjid].stockList = this.dataBeautify(
                bkjs[bkjid].stocks,
                'fields',
                'items'
              );
            }
          }
          // console.log(bkjs)
          this.themeMap = bkjs;
        },
        () => {
          setTimeout(() => {
            this.loadThemeMap();
          }, 5000);
        }
      );
    }
  },
  computed: {
    fluctuation () {
      let fluctuationDistributionData = this.$store.state.stockSummary.fluctuationDistributionData
      let countList = [];
      for (let i = 10; i >= -10; i--) {
        if (i === 10) {
          countList.push(fluctuationDistributionData.surged_limit_count);
          countList.push(
            fluctuationDistributionData.st_surged_limit_count
          );
        }
        countList.push(fluctuationDistributionData.normal_quote_count[i]);
        if (i === -10) {
          countList.push(
            fluctuationDistributionData.st_decline_limit_count
          );
          countList.push(fluctuationDistributionData.decline_limit_count);
        }
      }
      return countList
    }
  },
  components: {
    boardStock,
    boomStock,
    newStock,
    secStock,
    multiStock,
    boardDownStock,
    boardPreday,
    dingChart,
    toolbar
  },
  mixins: [shareMethodMixin]
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';
  .normal {
    .ban-table-tab.fixed {
      max-width: auto;
      width: 75%;
    }
    .hit-pool__table.table.fixed {
      max-width: auto;
      width: 75%;
    }
  }
  .ban-table {
    width: 100%;
    display: block;
    position: relative;
    min-height: 600px;
    &-tab {
      height: 44px;
      width: 100%;
      background: @dingDarkSec;
      &-fake {
        height: 44px;
        width: 100%;
        background: #3f4352;
      }
      &.fixed {
        position: fixed;
        top: 0;
        z-index: 20;
        // width: 75%;
        min-width: 1000px;
      }
      &-yidong {
        &.wantselect {
          color: @dingRise;
        }
      }
      &-container {
        width: 100%;
        display: flex;
        // overflow-x:hidden;
        position: absolute;
      }
      &-items {
        flex: 1;
        display: flex;

        .ban-table-tab-item {
          height: 44px;
          display: inline-block;
          padding-left: 15px;
          padding-right: 15px;
          text-align: center;
          cursor: pointer;
          background: @dingDarkSec;
          // &:hover .tab-item-text {
          //   color: #e5434d;
          // }
          .tab-item-text {
            line-height: 42px;
            height: 44px;
            display: inline-block;
            font-size: 14px;
            color: @dingFcDark;
            &:hover {
              color: #fff;
              border-bottom: 2px solid #e5434d;
            }
            &.checked {
              color: #fff;
              border-bottom: 2px solid #e5434d;
            }
          }
        }
        @media screen and (max-width: 1480px) {
          .ban-table-tab-item {
            padding-left: 15px;
            padding-right: 5px;
          }
        }
      }
      &-toolbar {
      }
      &-option {
        line-height: 44px;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0.75px;
        cursor: pointer;
        padding: 0;
        .option-container {
          // width: 136px;
          margin: 0;
          .option-item {
            height: 44px;
            width: 136px;
            display: block;
            background: #3e4352;
            line-height: 44px;
            font-size: 14px;
            color: #ffffff;
            letter-spacing: 0;
            padding-left: 16px;
            .option-switch {
              &:empty {
                display: none;
                ~ label {
                  position: relative;
                  display: inline-block;
                  height: 18px;
                  width: 32px;
                  top: 3px;
                  float: left;
                  line-height: 18px;
                  text-indent: 32px;
                  cursor: pointer;
                  &:before {
                    position: absolute;
                    display: block;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    content: "";
                    width: 32px;
                    background-color: #efefef;
                    border-radius: 9px;
                    transition: all 100ms ease-in;
                  }
                  &:after {
                    position: absolute;
                    display: block;
                    content: "";
                    width: 16px;
                    top: 1px;
                    margin-left: 1px;
                    height: 16px;
                    background-color: #fff;
                    border-radius: 8px;
                    transition: all 100ms ease-in;
                  }
                }
              }
              &:checked ~ label {
                &:before {
                  background-color: #e6394d;
                }
                &:after {
                  margin-left: 15px;
                }
              }
            }
          }
        }
        &-btn {
          padding: 0 24px 0 2px;
          line-height: 16px;
          display: inline-block;
          position: relative;
          top: -1px;
        }
      }
      &-advice {
        line-height: 44px;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0.75px;
        cursor: pointer;
        padding: 0;
        &-btn {
          padding: 0 24px 0 2px;
          line-height: 16px;
          display: inline-block;
          position: relative;
          top: -1px;
        }
      }
    }
    &-main {
      width: 100%;
      min-height: 600px;
      display: flex;
      position: relative;
    }
  }


</style>
<style lang='less'>
@import '../../styles/variables.less';
.ban {
  .-market-color--green {
    color: @dingDown !important;
  }
  .-market-color--red {
    color: @dingRise !important;
  }
}
 .ban{
    &-sidebar {
      display: block;
      width: 25%;
      display: flex;
      flex-direction: column;
      height: 100vh;
      z-index: 20;
      min-width: 280px;
      box-shadow: -2px 0 12px 0 rgba(0, 0, 0, 0.1);
      background: @dingDarkThird;
      &.fixed {
        position: fixed;
        top: 0;
        right: 0;
      }
      // flex:0;
    }
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
body::-webkit-scrollbar {
  width: 10px;
}

body::-webkit-scrollbar-track {
  background: #fff;
}

body::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 5px;
  outline: 1px solid slategrey;
}

// body.dark::-webkit-scrollbar-track {
//   background:@dingDarkThird;
// }

// body.dark::-webkit-scrollbar-thumb {
//   background-color: darkgrey;
//   outline: 1px solid slategrey;
// }
// body.black::-webkit-scrollbar{
//   width: 14px;
// }
body.dark::-webkit-scrollbar {
  width: 14px;
}
body.dark::-webkit-scrollbar-track {
  background: @dingDarkThird;
}

body.dark::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
  /*outline: 1px solid #2f2f31;*/
}
body.dark::-webkit-scrollbar-thumb:hover {
  background-color: darkgrey;
  border-radius: 20px;
  border: 4px solid @dingDarkThird;
  /*outline: 1px solid #3b3b3d;*/
}

.ban-chart-date {
  font-family: Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB,
    Heiti SC, Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  .ivu-date-picker {
    .ivu-select-dropdown {
      border-radius: 0;
    }
    .ivu-date-picker-header {
      // display: none;
      background: #3e4352;
      border: none;
      color: #fff;
      .ivu-date-picker-next-btn-arrow-double {
        display: none;
      }
      .ivu-date-picker-prev-btn-arrow-double {
        display: none;
      }
    }
    .ivu-picker-panel-body {
      &:before {
        content: "";
        display: block;
        position: absolute;
        top: -6px;
        left: 27px;
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #636a7f;
      }
    }
    .ivu-picker-panel-content {
      background: #3e4352;
      padding: 5px;
      position: relative;
      &:before {
        content: "";
        display: block;
        top: 0;
        left: 0;
        right: 0;
        height: 39px;
        position: absolute;
        background: @dingDarkSec;
      }
      .ivu-date-picker-cells {
        margin: 0;
        &-header {
          background: @dingDarkSec;
          padding: 3px 0;
          font-size: 14px;
          position: relative;
          span {
            color: #e6e6e6;
          }
        }
        &-cell {
          font-size: 14px; // -webkit-tap-highlight-color:red;
          em {
            color: #e6e6e6;
            border-radius: 0;
          }
          &-next-month {
            display: none;
          }
          &-prev-month {
            // display: none;
            em {
              color: #3e4352;
            }
          }

          &-selected {
            em {
              color: #e6e6e6;
              position: relative;
              background: transparent;
              &:before {
                content: "";
                display: block;
                bottom: 0;
                left: 3px;
                right: 3px;
                height: 2px;
                position: absolute;
                background: #f2564e;
              }
            }
          }
          &-today {
            em {
              color: #e6e6e6;
              position: relative;
              background: transparent;
              &:after {
                content: "";
                display: none;
              }
            }
          }
          &:hover {
            em {
              background: transparent;
              position: relative;
              &:before {
                content: "";
                display: block;
                bottom: 0;
                left: 3px;
                right: 3px;
                height: 2px;
                position: absolute;
                background: #bcbcbc;
              }
            }
          }
          &-disabled {
            background: #3e4352;
            em {
              color: #666;
            }
            &:hover {
              em:after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
.ban-table-tab-option {
  position: relative;
  .ivu-poptip-popper[x-placement^="bottom"] {
    padding: 0;
    min-width: 120px;
    .ivu-poptip-arrow {
      display: none;
    }
    .ivu-poptip-body {
      padding: 0;
    }
  }
}
nav.nav {
  min-width: 1000px;
}
footer.common-footer {
  display: none;
  min-width: 1280px;
  p {
    display: none;
  }
}
.ban-special {
  nav.nav {
    width: 75%;
    min-width: 1000px;
    .container{
      max-width: 100%;
    }
    .nav-left {
      flex: 1;
    }
    .nav-right {
      flex: 0 1 30%;
    }
  }
  .footer {
    display: none;
    margin-top:0;
    height: 0;
    min-width: 1280px;
    p {
      display: none;
    }
  }
}

.gutter {
  cursor: row-resize;
  background: #efefef;
}
.dark .gutter {
  background: #343a46;
  overflow: visible;
  position: relative;
  &:before {
    content: url(/img/drag.png);
    position: absolute;
    line-height: 10px;
    top: 0;
    height: 10px;
    width: 20px;
    left: 50%;
    cursor: row-resize;
  }
  &:after {
    content: "";
    position: absolute;
    line-height: 10px;
    top: 0;
    height: 40px;
    left: 0;
    right: 60px;
    cursor: row-resize;
  }
}
.dark {
  .hit-pool__table.table {
    background-color: @dingDarkSec;
  }
  .hit-pool__table.table tr {
    border-bottom: 1px solid #3f4352;
  }
  .hit-pool__table.table .hit-pool__table-body {
    color: #999999;
  }
}
.border-style-1{
  border: 1px solid #18A66B;
}
.border-style-2{
  border: 1px solid #BCBCBC;
}
.border-style-3{
  border: 1px solid #F2564E;
}
</style>
