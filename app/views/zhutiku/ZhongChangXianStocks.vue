<template>
  <stock-group :stocks="stocks" :real="real" />  
</template>

<script>
import StockGroup from '~/components/StockGroup'

export default {
  components: {
    StockGroup
  },
  props: {
    stocks: {
      type: Array
    },
    real: {
      type: Object
    }
  }
}
</script>
