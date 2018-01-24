<template>
  <div>
    <div v-if="accessMode == 1" class="stocklist-pool-main">
      <table :style="{marginTop:poolFixed?'86px':0}" v-if="filterList && filterList.length && !isSpecial" class="stocklist-pool-table">
        <colgroup>
          <col style="width:40px;">
          <col style="width:100px;">
          <col style="width:290px;">
          <col style="width:110px;">
          <col style="width:110px;">
          <col style="width:110px;">
          <col style="width:110px;">
          <col style="width:110px;">
          <col style="width:110px;">
          <col style="width:110px;">
        </colgroup>
        <thead :class="{'fixed':poolFixed}" class="stocklist-pool-thead">
          <tr>
            <th style="width:40px;" class="stocklist-pool-th stocklist-pool-th-index">序号</th>
            <th style="width:100px;" class="stocklist-pool-th stocklist-pool-th-name-threeline">股票名称</th>
            <th style="width:290px;" class="stocklist-pool-th stocklist-pool-th-reason">理由</th>
            <sort-thead style="width:110px;" label="最新价" @sort="startSort" :sort-rule="sortRule" target-prop="last_px" />
            <sort-thead style="width:110px;" label="涨跌幅" @sort="startSort" :sort-rule="sortRule" target-prop="px_change_rate" />
            <sort-thead style="width:110px;" label="换手率" @sort="startSort" :sort-rule="sortRule" target-prop="turnover_ratio" />
            <sort-thead style="width:110px;" label="流通市值" @sort="startSort" :sort-rule="sortRule" target-prop="circulation_value" />
            <sort-thead style="width:110px;" label="总市值" @sort="startSort" :sort-rule="sortRule" target-prop="market_value" />
            <sort-thead style="width:110px;" :two-line="true" label="市盈率<br/>TTM" @sort="startSort" :sort-rule="sortRule" target-prop="pe_rate" />
            <sort-thead style="width:110px;" :two-line="true" label="近五日<br/>资金流向" @sort="startSort" :sort-rule="sortRule" target-prop="flow" />
          </tr>
        </thead>
        <tbody v-if="filterList && filterList.length">
          <template v-for="(item, index) in filterList">
            <stock-item :sortTime="sortTime" @symbolOver="poolOver" @symbolLeave="poolLeave" :is-login="accessMode == 1" :scrollVal="scrollVal" v-if="item && (showWeakBindPool || item.IsImportant)" :key="item.Symbol" :symbol="item.Symbol" :ignoreImportant="!showWeakBindPool" :index="index" :icon-flag="iconFlag" :item="item" :sort-rule="sortRule" />
          </template>
        </tbody>

      </table>
      <!-- <component :is="specialComponent" v-if="isSpecial" @symbolOver="poolOver" @symbolLeave="poolLeave" @specialSort="startSort" :poolFixed="poolFixed" :sortRule="sortRule" :stockList="filterList" :loading="loading" /> -->
      <div v-if="poolImageShow" :style="{top:poolImageTop+'px',left:poolImageLeft+'px'}" class="img-div">
        <img :src="poolImageSrc" />
      </div>
      <!-- <div class="no-stock" v-if="loading">加载中</div> -->
      <div class="no-stock-image" v-if="(!filterList || !filterList.length)">
        <img class="no-stock-image-img" src="/img/nostock-inner.png" />
        <p class="no-stock-image-text">暂无符合当前筛选条件的股票</p>
      </div>
    </div>
    <div v-if="accessMode == 2" class="stocklist-pool-main-guest">
      <img class="stocklist-pool-main-guest-img" src="/img/no-login.png" />
      <p class="stocklist-pool-main-guest-text">登录后可查看全部内容</p>
    </div>
    <div v-if="accessMode == 3" class="stocklist-pool-main-forbid">
      <img class="stocklist-pool-main-forbid-img" src="/img/access_limit.png" />
      <p class="stocklist-pool-main-forbid-text">主题库试运行期间，限量访问</p>
      <p class="stocklist-pool-main-forbid-text">如有任何意见和建议，欢迎即时
        <a href="http://biaoge.wallstreetcn.com/f/O88l5G" target="_blank">反馈</a>
      </p>
    </div>
  </div>
</template>
<script>
import sortThead from './sortThead.vue'
import stockItem from './stockItem.vue'
import shareMethodMixin from '~/mixins/shareMethodMixin'

export default {
  props: ['accessMode', 'poolFixed', 'isSpecial', 'filterList', 'sortRule', 'scrollVal', 'showWeakBindPool', 'iconFlag', 'sortTime'],
  data () {
    return {
      targetImageSymbol: null,
      poolImageTop: 0,
      poolImageLeft: 0,
      poolImageSrc: null,
      poolImageShow: false
    }
  },
  methods: {
    startSort (prop) {
      this.$emit('sort-pool', prop)
    },
    poolOver (symbol, element) {
      if (symbol === this.targetImageSymbol) {
        this.poolImageShow = true
        return
      }
      this.targetImageSymbol = symbol
      this.poolImageTop = this.getElementTop(element) - this.getPageScroll().y;
      this.poolImageLeft = this.getElementLeft(element) + 180
      let gifname = this.hsCodeToWscn(symbol).toLowerCase()
      this.poolImageSrc = `http://image.sinajs.cn/newchart/min/n/${gifname}.gif`
      this.poolImageShow = true
    },
    poolLeave (symbol) {
      this.poolImageShow = false
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

