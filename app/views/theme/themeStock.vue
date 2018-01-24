<template>
  <div class="stocklist-container">
    <div class="stocklist-tabs">
      <div v-for="item in tabItems" class="stocklist-tabs-item">
        <span v-if="item.visible" @click="swapTab(item)" class="stocklist-tabs-item-text">{{item.label}}</span>
      </div>
      <div :style="{left:(selectedItem.index*(48+45)+15)+'px'}" class="stocklist-tabs-indicator"></div>
    </div>
    <div class="stocklist-main">
      <div v-if="tabItems[0].checked " class="stocklist-pool">
        <div :class="{'fixed':poolFixed}" class="stocklist-pool-icon">
          <span @click="changeIconStatus('jrlt')" :class="{active:iconFlag.jrlt}" class="stocklist-pool-icon-item">
            <i class="iconfont icon-jinrilongtou-xuanzhong"></i>今日龙头</span>
            <i aria-label="板块中当天的领涨股" class="iconfont icon-question hint--top-right hint--medium">&#xe668;</i>
          <span @click="changeIconStatus('rqlt')" :class="{active:iconFlag.rqlt}" class="stocklist-pool-icon-item">
            <i class="iconfont icon-renqilongtou-xuanzhong"></i>人气龙头</span>
            <i aria-label="板块中近期的活跃股" class="iconfont icon-question hint--top-right hint--medium" >&#xe668;</i>
          <span @click="changeIconStatus('hylt')" :class="{active:iconFlag.hylt}" class="stocklist-pool-icon-item">
            <i class="iconfont icon-hangyelongtou-xuanzhong"></i>行业龙头</span>
            <i aria-label="与板块设立逻辑最贴近的股票" class="iconfont icon-question hint--top-right hint--medium">&#xe668;</i>
          <span @click="changeIconStatus('all')" :class="{active:iconFlag.all}" class="stocklist-pool-icon-item">
            <i class="iconfont icon-quanbuyixuanzhong"></i>全部</span>
          <div class="stocklist-chain-all-title-filter inline-div">
            <i class="iconfont icon-ruoguanliangupiao"></i>
            <span class="stocklist-chain-all-title-filter-label">弱相关股票</span>
            <div class="inline-div">
              <input v-model="showWeakBindPool" type="checkbox" id="filter-switch" name="filter-switch" class="stocklist-chain-all-title-filter-switch" />
              <label for="filter-switch"></label>
            </div>
          </div>
        </div>
        <theme-stock-pool :sortTime="sortTime" @sort-pool="sortPool" :accessMode="accessMode" :poolFixed="poolFixed" :isSpecial="isSpecial" :filterList="filterList" :sortRule="sortRule" :scrollVal="scrollVal" :showWeakBindPool="showWeakBindPool" :iconFlag="iconFlag" />
      </div>
      <div v-if="tabItems[1].checked" class="stocklist-chain">
        <chain-stock-pool :isLogin="isLogin" :sortTime="sortTime"  :accessMode="accessMode" :anchorFixed="anchorFixed" :scrollVal="scrollVal" :anchorList="anchorList" @sort-chain="sortChain" :poolFixed="poolFixed" :categories="categories" :sort-rule="chainSortRule" />
      </div>
    </div>
  </div>
</template>
<script>
import shareMethodMixin from '~/mixins/shareMethodMixin'
import themeStockPool from './themeStockPool'
import chainStockPool from './chainStockPool'
export default {
  props: ['id'],
  data () {
    return {
      tabItems: [
        {
          label: '股票池',
          checked: true,
          index: 0,
          left: 0,
          class: 'stocklist-pool',
          visible: true
        },
        {
          label: '产业链',
          checked: false,
          index: 1,
          left: 58,
          class: 'stocklist-chain',
          visible: true
        }
      ],
      sortRule: {
        targetProp: 'px_change_rate',
        mode: 'desc'
      },
      chainSortRule: {
        targetProp: 'px_change_rate',
        mode: 'default'
      },
      iconFlag: {
        jrlt: false,
        rqlt: false,
        hylt: false,
        all: true
      },
      poolTop: 0,
      anchorList: [],
      anchorTop: 0,
      showWeakBindPool: true,
      poolFixed: false,
      scrollVal: 0,
      targetImageSymbol: null,
      sortTime: 0,
      anchorFixed: false,
      stockDictional: {
      }
    }
  },
  components: {
    shareMethodMixin,
    themeStockPool,
    chainStockPool
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll);
    if (this.themeInfo.Ssets && this.themeInfo.Ssets.length === 1 && this.themeInfo.Ssets[0].Categories && this.themeInfo.Ssets[0].Categories.length && this.themeInfo.AllStocks) {
      this.themeInfo.Ssets[0].AllStocks.map(item => {
        this.stockDictional[item.Symbol] = item
      })
    } else {
      this.tabItems[1].visible = false
    }
    if (this.anchorTop === 0 && this.tabItems[1].checked && this.isLogin) {
      this.$nextTick(() => {
        this.anchorTop = this.getElementTop(document.getElementById('stocklist-chain-right'))
        this.anchorList = this.anchorList.map(item => {
          item.offTop = this.getElementTop(document.querySelector('#' + item.id)) - 36
          return item
        })
      })
    }
    if (this.poolTop === 0 && this.tabItems[0].checked) {
      this.$nextTick(() => {
        this.poolTop = this.getElementTop(document.querySelector('.stocklist-pool-icon'))
      })
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  },
  computed: {
    selectedItem () {
      return this.tabItems.find((item) => {
        return item.checked
      })
    },
    themeInfo () {
      return this.$store.state.theme.themeInfo
    },
    categories () {
      if (this.themeInfo.Ssets && this.themeInfo.Ssets.length === 1 && this.themeInfo.Ssets[0].Categories && this.themeInfo.Ssets[0].Categories.length && this.themeInfo.AllStocks) {
        let c = JSON.parse(JSON.stringify(this.themeInfo)).Ssets[0].Categories.filter(item => {
          return item.Stocks && item.Stocks.length
        })
        let stockReal = this.$store.state.theme.stockReal
        this.anchorList = []
        c = c.map(cata => {
          if (cata.Stocks && cata.Stocks.length) {
            cata.Stocks = this.sortStockList(cata.Stocks.map(stock => {
              if (stock.Symbol && stockReal[stock.Symbol] && this.stockDictional[stock.Symbol]) {
                let i = Object.assign({}, stock, stockReal[stock.Symbol], this.stockDictional[stock.Symbol]);
                if (this.stockFlow[i.Symbol]) {
                  i.stockFlow = this.calculateStockFlow(this.stockFlow[i.Symbol], i.Symbol)
                }
                if (this.themeJinRiLongTou && (JSON.parse(JSON.stringify(this.themeJinRiLongTou)).indexOf(stock.Symbol) !== -1)) {
                  i.JinRiLongTou = JSON.parse(JSON.stringify(this.themeJinRiLongTou)).indexOf(stock.Symbol) + 1
                } else {
                  i.JinRiLongTou = 0
                }
                return i
              } else {
                return null
              }
            }).filter(i => {
              return i != null
            }), this.chainSortRule)
            this.anchorList.push({
              name: cata.Name,
              label: cata.Name,
              id: 'cata_' + cata.Id,
              active: false
            })
            return cata
          }
        })
        return c
      } else {
        return []
      }
    },
    themeStockList () {
      let stockList = JSON.parse(JSON.stringify(this.$store.state.theme.themeStockList))
      let stockReal = this.$store.state.theme.stockReal
      return stockList.map((item, index) => {
        if (stockReal[item.Symbol]) {
          let i = Object.assign({}, item, stockReal[item.Symbol]);
          if (this.stockFlow[item.Symbol]) {
            i.stockFlow = this.calculateStockFlow(this.stockFlow[item.Symbol], item.Symbol)
          }
          if (this.themeJinRiLongTou && (JSON.parse(JSON.stringify(this.themeJinRiLongTou)).indexOf(item.Symbol) !== -1)) {
            i.JinRiLongTou = JSON.parse(JSON.stringify(this.themeJinRiLongTou)).indexOf(item.Symbol) + 1
          } else {
            i.JinRiLongTou = 0
          }
          return i
        } else {
          return null
        }
      }).filter(i => {
        return i
      })
    },

    themeStockSymbol () {
      return this.$store.state.theme.themeStockSymbol
    },
    themeSets () {
      return this.$store.state.theme.themeSets
    },
    isLogin () {
      return this.$store.state.theme.accessMode === 1
    },
    themeJinRiLongTou () {
      return this.$store.state.theme.themeJinRiLongTou
    },
    accessMode () {
      return this.$store.state.theme.accessMode
    },
    excpetionTheme () {
      return this.$store.state.theme.excpetionTheme
    },
    isSpecial () {
      if (this.$store.state.theme.excpetionTheme) {
        return this.$store.state.theme.excpetionTheme.indexOf(this.id) > -1
      }
    },
    stocksId () {
      return this.themeStockList.map(item => {
        return item.Id
      })
    },
    stockFlow () {
      return this.$store.state.theme.stockFlow
    },
    filterList () {
      // debugger
      let templist = this.sortStockListPool(this.themeStockList, this.sortRule).filter(i => {
        return i && (this.showWeakBindPool || i.IsImportant)
      })
      if (!this.iconFlag.all && !this.iconFlag.jrlt && !this.iconFlag.rqlt && !this.iconFlag.hylt) {
        return templist.filter(i => {
          return i && (this.showWeakBindPool || i.IsImportant)
        })
      }
      if (this.iconFlag.all) {
        return templist.filter(i => {
          return i && (this.showWeakBindPool || i.IsImportant)
        })
      } else {
        return templist.filter(item => {
          return (item.JinRiLongTou && this.iconFlag.jrlt) || (item.RenQiLongTou && this.iconFlag.rqlt) || (item.HangYeLongTou && this.iconFlag.hylt)
        }).filter(i => {
          return i && (this.showWeakBindPool || i.IsImportant)
        })
      }
    }
  },
  methods: {
    swapTab (item) {
      this.tabItems = this.tabItems.map((i) => {
        if (i.index === item.index) {
          i.checked = true
          this.targetTabIndex = i.index
        } else {
          i.checked = false
        }
        return i
      })
      this.sortRule.targetProp = 'px_change_rate'
      this.sortRule.mode = 'desc'
      this.chainSortRule.targetProp = null
      this.chainSortRule.mode = 'default'
      // clearInterval(this.refreshInterval)
      // this.getStockList(true)
      this.$nextTick(() => {
        if (this.anchorTop === 0 && this.tabItems[1].checked && this.is_login) {
          this.$nextTick(() => {
            this.anchorTop = this.getElementTop(document.getElementById('stocklist-chain-right'))
            this.anchorList = this.anchorList.map(item => {
              item.offTop = this.getElementTop(document.querySelector('#' + item.id)) - 36
              return item
            })
          })
        }
        if (this.poolTop === 0 && this.tabItems[0].checked) {
          this.$nextTick(() => {
            this.poolTop = this.getElementTop(document.querySelector('.stocklist-pool-icon'))
          })
        }
      })
    },
    sortStockListPool (arr, rule) {
      switch (rule.mode) {
        case 'default':
          return arr.sort((a, b) => {
            return b['px_change_rate'] - a['px_change_rate']
          })
        case 'desc':
          return arr.sort((a, b) => {
            return b[rule.targetProp] - a[rule.targetProp]
          })
        case 'incr':
          return arr.sort((a, b) => {
            return a[rule.targetProp] - b[rule.targetProp]
          })
        default:
      }
    },
    sortStockList (arr, rule) {
      switch (rule.mode) {
        case 'default':
          return arr.sort((a, b) => {
            return b['IsImportant'] - a['IsImportant'] || ((a['HangYeLongTou'] && b['HangYeLongTou']) ? (a['HangYeLongTou'] - b['HangYeLongTou']) : (b['HangYeLongTou'] - a['HangYeLongTou'])) || ((a['Order'] && b['Order']) ? (a['Order'] - b['Order']) : (b['Order'] - a['Order'])) || b['px_change_rate'] - a['px_change_rate']
          })
        case 'desc':
          return arr.sort((a, b) => {
            return b[rule.targetProp] - a[rule.targetProp]
          })
        case 'incr':
          return arr.sort((a, b) => {
            return a[rule.targetProp] - b[rule.targetProp]
          })
        default:
      }
    },
    changeIconStatus (icon) {
      this.iconFlag[icon] = !this.iconFlag[icon]
      if (icon === 'all') {
        if (this.iconFlag['all']) {
          this.iconFlag['jrlt'] = false
          this.iconFlag['rqlt'] = false
          this.iconFlag['hylt'] = false
        }
      } else {
        this.iconFlag['all'] = false
        if (this.iconFlag['jrlt'] === false && this.iconFlag['rqlt'] === false && this.iconFlag['hylt'] === false) {
          this.iconFlag['all'] = true
        }
      }
    },
    calculateStockFlow (item, sy) {
      let keys = Object.keys(item);
      let flowArr = []
      // console.log(item)
      // debugger
      keys.map(i => {
        if (item[i]) {
          let val = (item[i].huge_buy ? item[i].huge_buy : 0) + (item[i].large_buy ? item[i].large_buy : 0) + (item[i].medium_buy ? item[i].medium_buy : 0) + (item[i].small_buy ? item[i].small_buy : 0) - (item[i].huge_sale ? item[i].huge_sale : 0) - (item[i].large_sale ? item[i].large_sale : 0) - (item[i].medium_sale ? item[i].medium_sale : 0) - (item[i].small_sale ? item[i].small_sale : 0)
          flowArr.push(val)
        } else {
          flowArr.push(0)
        }
      })
      // console.log(flowArr)
      return flowArr
    },

    sortPool (prop) {
      if (prop === 'flow') return
      if (this.sortRule.targetProp !== prop) {
        this.sortRule.targetProp = prop
        this.sortRule.mode = 'desc'
      } else {
        switch (this.sortRule.mode) {
          case 'default':
            this.sortRule.mode = 'desc'
            break;
          case 'desc':
            this.sortRule.mode = 'incr'
            break;
          case 'incr':
            this.sortRule.mode = 'default'
            break;
          default:
        }
      }
      this.sortTime = this.sortTime + 1
      this.$emit('refresh')
    },

    sortChain (prop) {
      if (prop === 'flow') return
      if (this.chainSortRule.targetProp !== prop) {
        this.chainSortRule.targetProp = prop
        this.chainSortRule.mode = 'desc'
      } else {
        switch (this.chainSortRule.mode) {
          case 'default':
            this.chainSortRule.mode = 'desc'
            break;
          case 'desc':
            this.chainSortRule.mode = 'incr'
            break;
          case 'incr':
            this.chainSortRule.mode = 'default'
            break;
          default:
        }
      }
    },

    handleScroll () {
      let top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
      this.scrollVal = top
      if (this.anchorTop && this.tabItems[1].checked) {
        if (top > this.anchorTop && !this.anchorFixed) {
          this.anchorFixed = true
        }
        if (top < this.anchorTop && this.anchorFixed) {
          this.anchorFixed = false
        }
        if (this.anchorList.length) {
          let self = this
          this.anchorList = this.anchorList.map((item, index) => {
            let nextOfftop = (index === self.anchorList.length - 1) ? Number.POSITIVE_INFINITY : self.anchorList[index + 1].offTop - 64
            if (!item.active && top > item.offTop - 64 && top <= nextOfftop) {
              self.activeChain = index;
              self.anchorList = self.anchorList.map(i => {
                i.active = false
                return i
              })
              item.active = true
            }
            return item
          })
        }
      } else if (this.poolTop && this.tabItems[0].checked) {
        if (top > this.poolTop && !this.poolFixed) {
          this.poolFixed = true
        }
        if (top < this.poolTop && this.poolFixed) {
          this.poolFixed = false
        }
      }
    }

  },
  mixins: [shareMethodMixin]
}
</script>
<style lang="less">
.stocklist-container {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  .stocklist-tabs {
    // border-bottom: 1px solid #D8D8D8;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #d8d8d8;
    }
    &-item {
      display: inline-block;
      margin-right: 15px;
      cursor: pointer;
      padding: 0 15px;
      &-text {
        padding: 5px 0;
        display: block;
      }
    }
    &-indicator {
      display: block;
      position: absolute;
      bottom: 0;
      width: 48px;
      background: #E6394D;
      height: 1px;
      transition: all .3s;
    }
  }
  .stocklist-pool-main {
    display: block;
    width: 1200px;
    position: relative;
    &>.img-div {
      background: #fff;
      position: fixed;
      width: 545px;
      height: 300px;
      z-index: 10;
    }
    &-guest {
      width: 1200px;
      height: 400px;
      background: url('/pool-unlog.png') #F6F7FB;
      background-size: cover;
      position: relative;
      cursor: pointer;
      &-img {
        margin-top: 140px;
        position: relative;
        margin-left: 50%;
        left: -30px;
      }
      &-text {
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
    &-forbid {
      width: 1200px;
      height: 400px;
      background: url('/pool-unlog.png') #F6F7FB;
      background-size: cover;
      position: relative;
      cursor: pointer;
      &-img {
        margin-top: 140px;
        position: relative;
        margin-left: 50%;
        left: -30px;
      }
      &-text {
        font-size: 14px;
        color: #999;
        text-align: center;
        &>a {
          color: #E6394D;
        }
      }
    }
  }
  .stocklist-main {
    display: block;
    width: 1200px;
    position: relative;
    .stocklist-pool {
      position: relative;
      background: #fff;
      &-table {
        background-image: url('/water-mark.png');
        background-repeat: repeat;
        .stocklist-pool-thead {
          border-bottom: 1px solid #efefef;
          background: #fff;
          width: 1200px;
          z-index: 1;
          &.fixed {
            position: fixed;
            top: 50px;
            left: 50%;
            margin-left: -600px;
          }
          tr{
            border:1px solid #efefef;
          }
        }
        .stocklist-pool-thead-chain {
          border-bottom: 1px solid #efefef;
          background: #fff;
          width: 1046px;
          z-index: 1;
          &.fixed {
            position: fixed;
            top: 40px;
            left: 50%;
            margin-left: -600px;
          }
        }
        th{
          background: #fafafa;
          &.sorting{
            // color:#120f0a;
            background:rgba(230, 57, 77,0.06);
            color:#333;
          }
        }
        .stocklist-pool-th {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
          background: #fafafa;
          line-height: 40px;
          &-index {
            width: 50px;
            text-align: center;
          }
          &-name {
            width: 150px;
            text-align: left;
            &-threeline {
              width: 90px;
              text-align: center;
            }
          }
          &-reason {
            text-align: center;
            width: 240px;
          }
        }
      }
      &-icon {
        height: 50px;
        padding: 14px;
        color: #d8d8d8;
        background: #F6F7FB;
        .stocklist-chain-all-title-filter {
          padding-top: 0;
        }
        &.fixed {
          display: block;
          position: fixed;
          top: 0;
          width: 1200px;
          margin: 0 auto;
          background: #F6F7FB;
          z-index: 1;
        }
        .icon-question{
          font-size: 12px;
          line-height: 18px;
          color:#BCBCBC;
          display: inline-block;
          cursor: pointer;
          margin-right: 36px;
          margin-left: 0;
          // float: left;
          vertical-align: bottom;
          &:hover{
            color:#353A47;
          }
        }
        &-item {
          font-size: 14px;
          line-height: 18px;
          display: inline-block;
          vertical-align: bottom;
          // float: left;
          cursor: pointer;
          color: #666;
          vertical-align: middle;
          &>i {
            vertical-align: bottom;
            font-size: 18px;
            line-height: 18px;
            margin-right: 5px;
            color: #d8d8d8;

          }

          &>input {
            opacity: 0;
            margin-left: 6px;
          }
          &.active {
            &>input {
              opacity: 1;
              margin-left: 6px;
            }
            &>i {
              vertical-align: bottom;
              color: #d8d8d8;
              &.icon-jinrilongtou-xuanzhong {
                color: #FFA387;
              }
              &.icon-renqilongtou-xuanzhong {
                color: #FFAA00;
              }
              &.icon-hangyelongtou-xuanzhong {
                color: #FF6D00;
              }
              &.icon-quanbuyixuanzhong {
                color: #e6394d;
              }
            }
          }

          &:hover {
            color: #E6394D;
            &>i {
              color: #E6394D;
            }
          }
        }
      }
      .no-stock {
        text-align: center;
        color: #999999;
        &-image {
          background: #fff;
          width: 1200px;
          height: 400px;
          position: relative;
          &-img {
            margin-top: 140px;
            position: relative;
            margin-left: 50%;
            left: -30px;
          }
          &-text {
            font-size: 14px;
            color: #999;
            text-align: center;
          }
        }
      }
    }

    .stocklist-chain {
      position: relative;
      padding-top: 8px;
      display: block;
      &>.img-div {
        background: #fff;
        position: fixed;
        width: 545px;
        height: 300px;
        z-index: 10;
      }
      &-left {
        display: inline-block;
        width: 1046px;
        &-unlog {
          height: 400px;
          background: url('/chain-unlog.png');
          background-size: cover;
          cursor: pointer;
          &-img {
            margin-top: 140px;
            position: relative;
            margin-left: 50%;
            left: -30px;
          }
          &-text {
            font-size: 14px;
            color: #999;
            text-align: center;
          }
        }
        &-forbid {
          height: 400px;
          background: url('/chain-unlog.png');
          background-size: cover;
          cursor: pointer;
          &-img {
            margin-top: 140px;
            position: relative;
            margin-left: 50%;
            left: -30px;
          }
          &-text {
            font-size: 14px;
            color: #999;
            text-align: center;
            &>a {
              color: #E6394D;
            }
          }
        }
      }
      &-all {
        &-title {
          height: 40px;
          background: #fff;
          border-bottom: 1px solid #efefef;
          padding-right: 15px;
          &-label {
            color: #fff;
            font-size: 14px;
            line-height: 40px;
            background: #F3564D;
            width: 88px;
            float: left;
            text-align: center;
          }
          &-filter {
            float: right;
            padding-top: 8px;
            .iconfont {
              color: #D8D8D8;
            }
            &-label {
              font-size: 14px;
              color: #666666;
              letter-spacing: 0;
              line-height: 14px;
            }
            &-switch {
              &:empty {
                display: none;
                ~label {
                  position: relative;
                  display: inline-block;
                  height: 18px;
                  width: 40px;
                  top: 3px;
                  float: left;
                  line-height: 18px;
                  text-indent: 40px;

                  cursor: pointer;
                  &:before {
                    position: absolute;
                    display: block;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    content: '';
                    width: 40px;
                    background-color: #efefef;
                    border-radius: 9px;
                    box-shadow: inset 0 0 1px #999;
                    transition: all 100ms ease-in;
                  }
                  &:after {
                    position: absolute;
                    display: block;
                    top: 1px;
                    margin-left: 1px;
                    content: '';
                    width: 16px;
                    height: 16px;
                    background-color: #fff;
                    border-radius: 9px;
                    transition: all 100ms ease-in;
                  }
                }
              }
              &:checked~label {
                &:before {
                  background-color: #F3564D;
                }
                &:after {
                  margin-left: 23px;
                }
              }
            }
          }
        }
      }
      &-item {
        margin-bottom: 24px;
        background: #fff;
        &-title {
          height: 40px;
          background: #fff;
          border-bottom: 1px solid #efefef;
          padding-right: 15px;
          &.fixed {
            position: fixed;
            top: 0;
            width: 1046px;
            left: 50%;
            margin-left: -600px;
            z-index: 1;
          }
          &-label {
            color: #fff;
            font-size: 14px;
            line-height: 14px;
            background: #F3564D;
            padding: 13px 16px;
            float: left;
            text-align: center;
          }
        }
      }
      &-right {
        display: inline-block;
        width: 146px;
        background: #fff;
        flex-grow: 0;
        vertical-align: top;
        position: relative;
        overflow: auto;
        &.fixed {
          position: fixed;
          top: 0;
          max-height: 80%;
          left: 50%;
          margin-left: 450px;
        }
        &.unloged {
          position: relative;
          top: 0;
          max-height: 400px;
        }
        .stocklist-chain-anchor {
          position: relative;
          display: block;
          padding: 16px 20px 16px 30px;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          line-height: 20px;
          cursor: pointer;
          &:before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 20px;
            width: 1px;
            bottom: 0;
            background: #D8D8D8;
          }
          &:after {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            margin-top: -5px;
            margin-left: -5px;
            left: 22px;
            width: 7px;
            height: 7px;
            border-radius: 4px;
            background: #D8D8D8;
          }
          &.active-anchor:after {
            background: #EB4651;
          }
          &:first-child:before {
            top: 50%;
          }
          &:last-child:before {
            bottom: 50%;
          }
        }
      }
    }
  }
}

// fade动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-left-enter-active {
  animation: slideInLeft 0.5s;
}

.slide-left-leave-active {
  animation: slideOutLeft 0.5s;
}

.slide-right-enter-active {
  animation: slideInRight 0.5s;
}

.slide-right-leave-active {
  animation: slideOutRight 0.5s;
}

@keyframes slideInRight {
  from {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }

  to {
    visibility: hidden;
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }
}

@keyframes slideOutRight {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
}
</style>

