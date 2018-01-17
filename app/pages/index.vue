<template>
  <section>
    <banner />
    <indexes />
    <zhutiku />
    <section class="home-main-container main-container">
      <section class="home-msgs-container">
        <msgs-container />
      </section>
      <aside class="home-aside">
        <data-center />
        <yuanchuang />
        <trending />
        <ambush />
      </aside>
    </section>
  </section>
</template>

<script>
import Indexes from '~/views/home/Indexes'
import Banner from '~/views/home/Banner'
import Zhutiku from '~/views/home/Zhutiku'
import MsgsContainer from '~/views/home/MsgsContainer'
import Yuanchuang from '~/views/home/Yuanchuang'
import DataCenter from '~/components/DataCenter'
import Trending from '~/components/Trending'
import Ambush from '~/components/Ambush'

export default {
  async asyncData ({ store }) {
    await Promise.all([
      store.dispatch('homeMsgs/getMsgs'),
      store.dispatch('homeMsgs/getHotSubjects'),
      store.dispatch('market/getIndexes'),
      store.dispatch('market/getQuoteChange'),
      store.dispatch('market/getThermometer'),
      store.dispatch('zhutiku/getZhutikuRankAsc'),
      store.dispatch('zhutiku/getZhutikuRankDesc'),
      store.dispatch('yuanchuang/getTop'),
      store.dispatch('settings/getTrending'),
      store.dispatch('settings/getSettings')
    ])
  },
  components: {
    Indexes,
    Banner,
    Zhutiku,
    DataCenter,
    Yuanchuang,
    Trending,
    Ambush,
    MsgsContainer
  },
  mounted () {
    const { dispatch } = this.$store
    dispatch('external/getBaiduTTSToken')
    dispatch('settings/getTrending')
    this.shortTimer = setInterval(() => {
      dispatch('market/getIndexes')
      dispatch('market/getQuoteChange')
      dispatch('market/getThermometer')
      dispatch('settings/getTrending')
    }, 1000 * 30)
    this.longTimer = setInterval(() => {
      dispatch('zhutiku/getZhutikuRankAsc')
      dispatch('zhutiku/getZhutikuRankDesc')
      dispatch('yuanchuang/getTop')
      dispatch('settings/getSettings')
    }, 1000 * 30)
    this.FiveMinuteTimer = setInterval(() => {
      dispatch('homeMsgs/getHotSubjects')
    }, 1000 * 60 * 5)
  },
  destroyed () {
    clearInterval(this.shortTimer)
    clearInterval(this.longTimer)
    clearInterval(this.FiveMinuteTimer)
  }
}
</script>

<style lang="less">
.home-main-container {
  width: 1200px;
  margin: 20px auto;
  overflow: hidden;
}

.home-msgs-container {
  float: left;
  width: 832px;
}

.home-aside {
  float: right;
  width: 344px;
}
</style>
