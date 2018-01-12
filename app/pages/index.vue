<template>
  <section>
    <banner />
    <indexes />
    <zhutiku />
    <section class="home-main-container main-container">
      <section class="home-msgs-container">
        1   
      </section>
      <aside class="home-aside">
        <data-center />
      </aside>
    </section>
  </section>
</template>

<script>
import Indexes from '~/views/home/indexes'
import msgs from '~/views/home/msgs'
import banner from '~/views/home/banner'
import zhutiku from '~/views/home/zhutiku'
import dataCenter from '~/components/data-center'

export default {
  async asyncData ({ store }) {
    await Promise.all([
      store.dispatch('home/getMsgs', { subjids: '9', limit: 30 }),
      store.dispatch('home/getBanner'),
      store.dispatch('market/getIndexes'),
      store.dispatch('market/getQuoteChange'),
      store.dispatch('market/getThermometer'),
      store.dispatch('zhutiku/getZhutikuRankAsc'),
      store.dispatch('zhutiku/getZhutikuRankDesc')
    ])
  },
  components: {
    Indexes,
    msgs,
    banner,
    zhutiku,
    dataCenter
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
