<template>
  <ul class="stock-group" v-if="stocks">
    <li class="stock-group-item" v-for="stock in stocks" :key="stock.symbol">
      <a 
        :class="{
          'stock-group-item-link': true,
          [renderFontColor(real[stock.Symbol])]: true,
          '-market-color--balance': !renderFontColor(real[stock.Symbol])
        }"
        :href="`/stock/${stock.Symbol}`"
        target="_blank"
      >
        <i :class="{'iconfont': true, [renderIcon(real, stock.Symbol)]: true}"></i>
        <span class="stock-group-item-name">{{  stock.Name }}</span>
        <span class="stock-group-item-rate">{{ renderRate(real[stock.Symbol]) || '--' }}</span>
      </a>
      
    </li>
  </ul>
</template>


<script>
export default {
  props: {
    stocks: {
      type: Array
    },
    real: {
      type: Object
    }
  },
  methods: {
    renderFontColor (val) {
      if (!val || val.trade_status === 'HALT') return
      // 默认给了balance的class
      // return '-market-color--balance'
      const rate = val.px_change_rate
      return rate >= 0 ? `-market-color--rise` : `-market-color--decline`
    },
    renderIcon (val, b) {
      return val.px_change_rate >= 0 ? 'icon-gupiaozhang' : 'icon-gupiaodie'
    },
    renderRate (val) {
      if (!val) return
      if (val.trade_status === 'HALT') {
        return '--'
      } else {
        const rate = val.px_change_rate.toFixed(2)
        return rate >= 0 ? `+${rate}%` : `${rate}%`
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.stock-group {
  display: inline-block;
  font-size: 12px;
  .iconfont {
    font-size: 14px;
    margin-right: 2px;
  }
}

.stock-group-item {
  display: inline-block;
  margin-right: 12px;
  &-link {
    display: block;
  }
  &-name {
    display: inline-block;
    // min-width: 48px;
  }
  &-rate {
    display: inline-block;
    // min-width: 35px;
    margin-left: 3px;
  }
  &:last-child {
    margin-right: 0;
  }
}

</style>
