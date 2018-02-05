<template>
  <div>
    <div v-if="chainImageShow" :style="{top:chainImageTop+'px',left:chainImageLeft+'px'}" class="img-div">
    <img :src="chainImageSrc" />
    </div>
    <div v-if="accessMode == 1" class="stocklist-chain-left">
      <template v-if="chainStockList.length">
        <div v-if="anchorFixed " class="stocklist-chain-item-title fixed">
          <div class="stocklist-chain-item-title-label">{{chainStockList[activeChain].Name}}</div>
          <div class="stocklist-chain-all-title-filter inline-div">
            <i class="iconfont icon-ruoguanliangupiao"></i>
            <span class="stocklist-chain-all-title-filter-label">弱相关股票</span>
            <div class="inline-div">
              <input v-model="showWeakBind" type="checkbox" id="filter-switch" name="filter-switch" class="stocklist-chain-all-title-filter-switch" />
              <label for="filter-switch"></label>
            </div>
          </div>
        </div>
        <table class="stocklist-pool-table">
          <thead v-if="anchorFixed" class="stocklist-pool-thead-chain fixed">
            <tr>
              <th style="width:40px;" class="stocklist-pool-th stocklist-pool-th-index">序号</th>
              <th style="width:100px;" class="stocklist-pool-th stocklist-pool-th-name-threeline">股票名称</th>
              <th style="width:290px;" class="stocklist-pool-th stocklist-pool-th-reason">理由</th>
              <sort-thead style="width:88px;" label="最新价" @sort="startSortChain" :sort-rule="sortRule" target-prop="last_px" />
              <sort-thead style="width:88px;" label="涨跌幅" @sort="startSortChain" :sort-rule="sortRule" target-prop="px_change_rate" />
              <sort-thead style="width:88px;" label="换手率" @sort="startSortChain" :sort-rule="sortRule" target-prop="turnover_ratio" />
              <sort-thead style="width:88px;" label="流通市值" @sort="startSortChain" :sort-rule="sortRule" target-prop="circulation_value" />
              <sort-thead style="width:88px;" label="总市值" @sort="startSortChain" :sort-rule="sortRule" target-prop="market_value" />
              <sort-thead style="width:88px;" :two-line="true" label="市盈率<br/>TTM" @sort="startSortChain" :sort-rule="sortRule" target-prop="pe_rate" />
              <sort-thead style="width:88px;" :two-line="true" label="近五日<br/>资金流向" @sort="startSortChain" :sort-rule="sortRule" target-prop="flow" />
            </tr>
          </thead>
        </table>

        <div v-for="(item,index) in chainStockList" class="stocklist-chain-item">
          <div :id="'cata_'+item.Id" :name="item.Name" class="stocklist-chain-item-title">
            <div class="stocklist-chain-item-title-label">{{item.Name}}</div>
            <div v-if="index == 0" class="stocklist-chain-all-title-filter inline-div">
              <i class="iconfont icon-ruoguanliangupiao"></i>
              <span class="stocklist-chain-all-title-filter-label">弱相关股票</span>
              <div class="inline-div">
                <input v-model="showWeakBind" type="checkbox" id="filter-switch" name="filter-switch" class="stocklist-chain-all-title-filter-switch" />
                <label for="filter-switch"></label>
              </div>
            </div>
          </div>
          <table v-if="item.Stocks && item.Stocks.length" class="stocklist-pool-table">
            <colgroup>
              <col style="width:40px;">
              <col style="width:100px;">
              <col style="width:290px;">
              <col style="width:88px;">
              <col style="width:88px;">
              <col style="width:88px;">
              <col style="width:88px;">
              <col style="width:88px;">
              <col style="width:88px;">
              <col style="width:88px;">
            </colgroup>
            <thead :class="{'fixed':poolFixed}" class="stocklist-pool-thead">
              <tr>
                <th style="width:40px;" class="stocklist-pool-th stocklist-pool-th-index">序号</th>
                <th style="width:100px;" class="stocklist-pool-th stocklist-pool-th-name-threeline">股票名称</th>
                <th style="width:290px;" class="stocklist-pool-th stocklist-pool-th-reason">理由</th>
                <sort-thead style="width:88px;" label="最新价" @sort="startSortChain" :sort-rule="sortRule" target-prop="last_px" />
                <sort-thead style="width:88px;" label="涨跌幅" @sort="startSortChain" :sort-rule="sortRule" target-prop="px_change_rate" />
                <sort-thead style="width:88px;" label="换手率" @sort="startSortChain" :sort-rule="sortRule" target-prop="turnover_ratio" />
                <sort-thead style="width:88px;" label="流通市值" @sort="startSortChain" :sort-rule="sortRule" target-prop="circulation_value" />
                <sort-thead style="width:88px;" label="总市值" @sort="startSortChain" :sort-rule="sortRule" target-prop="market_value" />
                <sort-thead style="width:88px;" label="市盈率<br/>TTM" :two-line="true" @sort="startSortChain" :sort-rule="sortRule" target-prop="pe_rate" />
                <sort-thead style="width:88px;" :two-line="true" label="近五日<br/>资金流向" @sort="startSortChain" :sort-rule="sortRule" target-prop="flow" />
              </tr>
            </thead>
            <tbody>
              <template v-for="(stockitem,index) in item.Stocks">
                <stock-item @symbolOver="chainOver" @symbolLeave="chainLeave" v-if="showWeakBind || stockitem.IsImportant " :isLogin="isLogin" :scrollVal="scrollVal" :ignoreImportant="!showWeakBind" :index="index" :icon-flag="null" :item="stockitem" :sort-rule="sortRule" />
              </template>
            </tbody>
          </table>
        </div>
      </template>
    </div>
    <div @click="goLogin" v-if="accessMode == 2" class="stocklist-chain-left stocklist-chain-left-unlog">
      <img class="stocklist-chain-left-unlog-img" src="/img/no-login.png" />
      <p class="stocklist-chain-left-unlog-text">登录后可查看全部内容</p>
    </div>
    <div v-if="accessMode == 3" class="stocklist-chain-left stocklist-chain-left-forbid">
      <img class="stocklist-chain-left-forbid-img" src="/img/access_limit.png" />
      <p class="stocklist-chain-left-forbid-text">主题库试运行期间，限量访问</p>
      <p class="stocklist-chain-left-forbid-text">如有任何意见和建议，欢迎即时
        <a href="http://biaoge.wallstreetcn.com/f/O88l5G" target="_blank">反馈</a>
      </p>
    </div>
    <div :class="{'fixed':anchorFixed,'unloged':!isLogin}" id="stocklist-chain-right" class="stocklist-chain-right">
      <template v-if="anchorList && anchorList.length">
        <div :class="{'active-anchor':item.active}" @click="anchorScroll(item)" class="stocklist-chain-anchor" v-for="item in anchorList">{{item.label}}</div>
      </template>
    </div>
  </div>
</template>
<script>
import sortThead from './sortThead.vue'
import stockItem from './stockItem.vue'
import shareMethodMixin from '~/mixins/shareMethodMixin'

export default {
  props: ['accessMode', 'anchorFixed', 'categories', 'sortRule', 'sortTime', 'isLogin', 'scrollVal', 'poolFixed', 'anchorList', 'activeChain'],
  data () {
    return {
      targetImageSymbol: null,
      chainImageSymbol: null,
      chainImageTop: 0,
      chainImageLeft: 0,
      chainImageSrc: null,
      chainImageShow: false,
      showWeakBind: false
    }
  },
  computed: {
    chainStockList () {
      if (this.categories && this.categories.length) {
        return this.categories.map(item => {
          let tempitem = JSON.parse(JSON.stringify(item))
          tempitem.Stocks = item.Stocks.filter(i => {
            // return i && (this.showWeakBind || i.IsImportant)
            return i
          })
          return tempitem
        })
      } else {
        return []
      }
    }
  },
  methods: {
    startSort (prop) {
      this.$emit('sort-pool', prop)
    },
    chainOver (symbol, element) {
      if (symbol === this.chainImageSymbol) {
        this.chainImageShow = true
        return
      }
      this.chainImageSymbol = symbol
      this.chainImageTop = this.getElementTop(element) - this.getPageScroll().y;
      this.chainImageLeft = this.getElementLeft(element) + 180
      // console.log(this.chainImageTop, this.chainImageLeft)
      let gifname = this.hsCodeToWscn(symbol).toLowerCase()
      this.chainImageSrc = `http://image.sinajs.cn/newchart/min/n/${gifname}.gif`
      this.chainImageShow = true
    },
    goLogin () {

    },
    chainLeave (symbol) {
      this.chainImageShow = false
    },
    startSortChain () {
      this.$emit('sort-chain')
    },
    anchorScroll (item) {
      if (this.isLogin) {
        window.scrollTo(0, this.getElementTop(document.getElementById(item.id)))
      }
    }
  },
  mixins: [shareMethodMixin],
  components: {
    sortThead,
    stockItem
  }
}
</script>

<style lang="less" scoped>

</style>

