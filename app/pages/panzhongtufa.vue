<template>
  <premium-subject :customization="customization">
    <HotMsgs slot="hotMsgs" />
  </premium-subject>
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import HotMsgs from '~/components/HotMsgs/PanZhongTuFa'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 779)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 779)
  },
  components: {
    PremiumSubject,
    HotMsgs
  },
  head () {
    return {
      title: `选股宝盘中突发 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '盘中突发更新'
      }
    }
  }
}
</script>
