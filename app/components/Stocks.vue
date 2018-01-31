<template>
  <stock-group :stocks="stocks" :real="real" />
</template>


<script>
import StockGroup from './StockGroup'

export default {
  components: {
    StockGroup
  },
  props: {
    stocks: {
      type: Array
    }
  },
  watch: {
    stocks (newVal) {
      if (newVal && newVal.length) {
        const stockSymbols = newVal.map(i => i.Symbol)
        this.$store.dispatch('stock/getReal', { symbols: stockSymbols })
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
        this.$store.dispatch('stock/getReal', { symbols: stocks.map(i => i.Symbol) })
      }
    }
  }
}
</script>
