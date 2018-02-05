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
import * as Cookies from 'js-cookie'

export default {
  components: {
    NavBar,
    CommonFooter,
    FixedTool,
    Login
  },
  mounted () {
    this.refreshToken()
    setInterval(() => {
      this.$store.dispatch('stock/refreshStocks')
    }, 30000)
  },
  methods: {
    refreshToken () {
      // console.log('refresh', Cookies.get('token'))
      this.$store.dispatch('user/saveAuth', {
        Token: Cookies.get('token'),
        nickname: Cookies.get('nickname')
      })
    }
  }
}
</script>
