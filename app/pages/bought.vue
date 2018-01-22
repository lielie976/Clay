<template>
  <section class="main-container">
    <section class="main-container-left">
      123
    </section>
    <section class="main-container-right">
      <tuo-shui-hot-msgs :msgs="$store.state.homeMsgs.msgs" />
      <!-- <zao-zhi-dao-hot-msgs :msgs="$store.state.homeMsgs.msgs" /> -->
    </section>
  </section>
</template>

<script>
import TuoShuiHotMsgs from '~/views/tuoshui/HotMsgs'

export default {
  components: {
    TuoShuiHotMsgs
  },
  async asyncData ({ store }) {
    await store.dispatch('homeMsgs/getMsgs')
  }
}
</script>
