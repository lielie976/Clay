<template>
  <div>
    <nav-bar />
    <div id="nuxt-layout-container">
      <nuxt/>
    </div>
    <fixed-tool />
    <common-footer />
    <login />
  </div>
</template>

<script>
import NavBar from '~/components/NavBar'
import CommonFooter from '~/components/CommonFooter'
import FixedTool from '~/components/FixedTool'
import Login from '~/components/Login'

export default {
  components: {
    NavBar,
    CommonFooter,
    FixedTool,
    Login
  },
  mounted () {
    setInterval(() => {
      this.$store.dispatch('stock/refreshStocks')
    }, 30000)
  },
  methods: {
  }
}
</script>
