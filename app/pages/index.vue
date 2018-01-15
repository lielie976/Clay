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
      store.dispatch('home/getBanner'),
      store.dispatch('homeMsgs/getMsgs'),
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
