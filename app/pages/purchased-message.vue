<template>
  <section class="main-container">
    <section class="main-container-left">
      <purchased-msgs :msgs="purchasedMsgs.msgs" :data="purchasedMsgs" />
    </section>
    <section class="main-container-right">
      <hot-msgs />
    </section>
  </section>
</template>

<script>
import HotMsgs from '~/components/PremiumSubject/HotMsgs'
import PurchasedMsgs from '~/components/PurchasedMsgs'
import texts from '~/utils/texts'

export default {
  components: {
    HotMsgs,
    PurchasedMsgs
  },
  async asyncData ({ store }) {
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
    await store.dispatch('premium/getHotMsgs', '581,679')
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
