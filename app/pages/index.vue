<template>
  <section class="container">
    <banner />
    <indexes />
    <msgs />
  </section>
</template>

<script>
import Indexes from '~/views/home/indexes'
import msgs from '~/views/home/msgs'
import banner from '~/views/home/banner'

export default {
  async asyncData ({ store }) {
    await store.dispatch('home/getMsgs', { subjids: '9', limit: 30 })
    await store.dispatch('home/getBanner')
    await store.dispatch('market/getIndexes')
    await store.dispatch('market/getQuoteChange')
  },
  components: {
    Indexes,
    msgs,
    banner
  }
}
</script>

<style lang="less">
@import '../styles/global.less';

.container {
  min-height: 100vh;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
