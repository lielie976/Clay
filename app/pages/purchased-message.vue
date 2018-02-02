<template>
  <section class="main-container">
    <section class="main-container-left">
      <purchased-msgs :msgs="purchasedMsgs.msgs" :data="purchasedMsgs" />
    </section>
    <section class="main-container-right">
      <tuo-shui-hot-msgs />
      <zao-zhi-dao-hot-msgs />
    </section>
  </section>
</template>

<script>
import TuoShuiHotMsgs from '~/components/HotMsgs/TuoShuiYanBao'
import ZaoZhiDaoHotMsgs from '~/components/HotMsgs/ZaoZhiDao'
import PurchasedMsgs from '~/components/PurchasedMsgs'
import texts from '~/utils/texts'

export default {
  components: {
    TuoShuiHotMsgs,
    ZaoZhiDaoHotMsgs,
    PurchasedMsgs
  },
  async asyncData ({ store }) {
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 581)
    await store.dispatch('premiumHotMsgs/getHotMsgs', 679)
  },
  head () {
    return {
      title: `已购精选文章 | ${texts.slogan}`
    }
  },
  computed: {
    purchasedMsgs () {
      return this.$store.state.purchasedMsgs
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
</style>
