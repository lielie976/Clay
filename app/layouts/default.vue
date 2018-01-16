<template>
  <div>
    <div id="nuxt-layout-container">
      <nuxt/>
    </div>
    <fixed-tool />
    <common-footer />
  </div>
</template>

<script>
import CommonFooter from '~/components/CommonFooter'
import FixedTool from '~/components/FixedTool'

export default {
  components: {
    CommonFooter,
    FixedTool
  },
  mounted () {
    setInterval(() => {
      this.$store.dispatch('stock/refreshStocks')
    }, 30000)
  }
}
</script>
