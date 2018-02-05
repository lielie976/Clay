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
    try {
      await store.dispatch('homeMsgs/getMsgs')
    } catch (err) {
      console.log(err)
    }
    try {
      await store.dispatch('homeMsgs/getHotSubjects')
    } catch (err) {
      console.log(err)
    }
    try {
      await Promise.all([
        store.dispatch('market/getIndexes'),
        store.dispatch('market/getQuoteChange'),
        store.dispatch('market/getThermometer')
      ])
    } catch (err) {
      console.log(err)
    }
    try {
      await Promise.all([
        store.dispatch('zhutiku/getZhutikuRankAsc'),
        store.dispatch('zhutiku/getZhutikuRankDesc')
      ])
    } catch (err) {
      console.log(err)
    }
    try {
      await store.dispatch('yuanchuang/getTop')
    } catch (err) {
      console.log(err)
    }
    try {
      await store.dispatch('settings/getTrending')
    } catch (err) {
      console.log(err)
    }
    try {
      await store.dispatch('settings/getSettings')
    } catch (err) {
      console.log(err)
    }
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
    dispatch('market/getIndexes')
    dispatch('market/getQuoteChange')
    dispatch('market/getThermometer')
    dispatch('settings/getTrending')
    dispatch('zhutiku/getZhutikuRankAsc')
    dispatch('zhutiku/getZhutikuRankDesc')
    dispatch('yuanchuang/getTop')
    dispatch('settings/getSettings')
    dispatch('homeMsgs/getHotSubjects')
    dispatch('homeMsgs/getMsgs')
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
