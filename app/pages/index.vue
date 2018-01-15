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
import Indexes from '~/views/home/indexes'
import banner from '~/views/home/banner'
import zhutiku from '~/views/home/zhutiku'
import MsgsContainer from '~/views/home/MsgsContainer'
import yuanchuang from '~/views/home/yuanchuang'
import dataCenter from '~/components/data-center'
import trending from '~/components/trending'
import ambush from '~/components/ambush'

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
    banner,
    zhutiku,
    dataCenter,
    yuanchuang,
    trending,
    ambush,
    MsgsContainer
  },
  mounted () {
    this.shortTimer = setInterval(() => {
      this.$store.dispatch('market/getIndexes')
      this.$store.dispatch('market/getQuoteChange')
      this.$store.dispatch('market/getThermometer')
      this.$store.dispatch('settings/getTrending')
    }, 5000)
    this.longTimer = setInterval(() => {
      this.$store.dispatch('zhutiku/getZhutikuRankAsc')
      this.$store.dispatch('zhutiku/getZhutikuRankDesc')
      this.$store.dispatch('yuanchuang/getTop')
      this.$store.dispatch('settings/getSettings')
    }, 30000)
    this.FiveMinuteTimer = setInterval(() => {
      this.$store.dispatch('homeMsgs/getHotSubjects')
    })
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
  margin: 20px auto;
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
