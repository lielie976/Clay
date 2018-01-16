<template>
  <ul class="stock-group" v-if="stocks">
    <li class="stock-group-item" v-for="stock in stocks" :key="stock.symbol" v-if="real[stock.Symbol]">
      <a 
        :class="{
          'stock-group-item-link': true,
          [renderFontColor(real[stock.Symbol])]: true
        }"
        :href="`/stock/${stock.Symbol}`"
        target="_blank"
      >
        <i :class="{'iconfont': true, [renderIcon(real, stock.Symbol)]: true}"></i>
        <span class="stock-group-item-name">{{  stock.Name }}</span>
        <span class="stock-group-item-rate">{{ renderRate(real[stock.Symbol]) }}</span>
      </a>
      
    </li>
  </ul>
</template>


<script>
export default {
  props: {
    stocks: {
      type: Array
    }
  },
  watch: {
    stocks (newVal) {
      if (newVal && newVal.length) {
        this.$store.dispatch('stock/addStock', newVal.map(i => i.Symbol))
      }
    }
  },
  computed: {
    real () {
      return this.$store.state.stock.real
    }
  },
  mounted () {
    this.getReal()
  },
  methods: {
    getReal () {
      const stocks = this.stocks
      if (stocks && stocks.length) {
        this.$store.dispatch('stock/getReal', {
          stocks: stocks.map(i => i.Symbol).join(',')
        })
      }
    },
    renderFontColor (val) {
      if (!val) return
      if (val.trade_status === 'HALT') {
        return '-market-color--balance'
      } else {
        const rate = val.px_change_rate
        return rate >= 0 ? `-market-color--rise` : `-market-color--descline`
      }
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
  &-up {
    color: $stockRiseColor;
    &:hover {
      color: $stockRiseHoverColor;
    }
  }
  &-down {
    color: $stockFallColor;
    &:hover {
      color: $stockFallHoverColor;
    }
  }
  &-fair {
    color: $stockFairColor;
    &:hover {
      color: $stockFairHoverColor;
    }
  }
}

</style>
