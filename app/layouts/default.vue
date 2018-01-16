<template>
  <div>
    <nav-bar />
    <div id="nuxt-layout-container">
      <nuxt/>
    </div>
    <fixed-tool />
    <common-footer />
  </div>
</template>

<script>
import NavBar from '~/components/NavBar'
import CommonFooter from '~/components/CommonFooter'
import FixedTool from '~/components/FixedTool'

export default {
  components: {
    NavBar,
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
