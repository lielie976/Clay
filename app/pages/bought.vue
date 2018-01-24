<template>
  <section class="main-container">
    <section class="main-container-left">
      <bought-msgs :msgs="$store.state.tuoshui.Messages" :data="boughtMsgs" />
    </section>
    <section class="main-container-right">
      <tuo-shui-hot-msgs :msgs="$store.state.tuoshui.Messages" />
      <zao-zhi-dao-hot-msgs :msgs="$store.state.zaozhidao.Messages" />
    </section>
  </section>
</template>

<script>
import TuoShuiHotMsgs from '~/components/HotMsgs/TuoShui'
import ZaoZhiDaoHotMsgs from '~/components/HotMsgs/ZaoZhiDao'
import BoughtMsgs from '~/components/BoughtMsgs'

export default {
  components: {
    TuoShuiHotMsgs,
    ZaoZhiDaoHotMsgs,
    BoughtMsgs
  },
  async asyncData ({ store }) {
    await store.dispatch('boughtMsgs/getBoughtMsgs')
    await store.dispatch('tuoshui/getInfo')
    await store.dispatch('zaozhidao/getInfo')
  },
  computed: {
    boughtMsgs () {
      return this.$store.state.boughtMsgs
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
</style>
