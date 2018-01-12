<template>
  <section class="container">
    <banner />
    <indexes />
    <zhutiku />
    <msgs />
  </section>
</template>

<script>
import Indexes from '~/views/home/indexes'
import msgs from '~/views/home/msgs'
import banner from '~/views/home/banner'
import zhutiku from '~/views/home/zhutiku'

export default {
  async asyncData ({ store }) {
    await Promise.all([
      store.dispatch('home/getMsgs', { subjids: '9', limit: 30 }),
      store.dispatch('home/getBanner'),
      store.dispatch('market/getIndexes'),
      store.dispatch('market/getQuoteChange'),
      store.dispatch('zhutiku/getZhutikuRankAsc'),
      store.dispatch('zhutiku/getZhutikuRankDesc')
    ])
  },
  components: {
    Indexes,
    msgs,
    banner,
    zhutiku
  }
}
</script>

<style lang="less">
.container {
  min-height: 100vh;
}
</style>
