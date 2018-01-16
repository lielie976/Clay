<template>
  <section class="zhutiku-page">
    <section class="zhutiku-search-sort-container">
      <search />
      <section class="zhutiku-sort-container">
        <rank />
      </section>
    </section>
    <section class="zhutiku-settings-container">
      <section class="zhutiku-main">
        <jin-ri-ji-hui />
        <zhong-chang-xian-ji-hui />
        <!-- {{> zhutiku/jinri/jinri data=data.JinRiJiHuiQianZhan}} -->
        <!-- {{> zhutiku/midLongTerm/midLongTerm data=data.ZhongChangXianJiHui}} -->
      </section>
      <section class="zhutiku-aside">
        <ambush />
      </section>
    </section>
  </section>

</template>

<script>
import Search from '~/views/zhutiku/Search'
import Rank from '~/views/zhutiku/Rank'
import JinRiJiHui from '~/views/zhutiku/JinRiJiHui'
import ZhongChangXianJiHui from '~/views/zhutiku/ZhongChangXianJiHui'
import Ambush from '~/components/Ambush'

export default {
  async asyncData ({ store }) {
    await Promise.all([
      store.dispatch('zhutiku/getZhutikuRankAsc'),
      store.dispatch('zhutiku/getZhutikuRankDesc'),
      store.dispatch('settings/getSettings')
    ])
  },
  components: {
    Search,
    Rank,
    Ambush,
    JinRiJiHui,
    ZhongChangXianJiHui
  },
  mounted () {
    const { dispatch } = this.$store
    this.timer = setInterval(() => {
      dispatch('zhutiku/getZhutikuRankAsc')
      dispatch('zhutiku/getZhutikuRankDesc')
      dispatch('settings/getSettings')
    }, 30 * 1000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.zhutiku-search-sort-container {
  background: #999;
  background: url('/img/zhutiku-bg.png') @navBarColor;
  background-size: cover;
  color:#fff;
  min-width: 1200px;
  height: 408px;
}

.zhutiku-settings-container {
  display: flex;
  padding: 24px 0;
  margin: 0 auto;
  width: 1200px;
}

.zhutiku-main {
  flex: 0 0 832px;
}

.zhutiku-aside {
  flex: 0 0 344px;
  margin-left: 24px;
}
</style>
