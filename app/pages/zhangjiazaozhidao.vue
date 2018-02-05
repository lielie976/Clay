<template>
  <premium-subject :customization="customization">
    <HotMsgs slot="hotMsgs" />
  </premium-subject>
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import HotMsgs from '~/components/HotMsgs/TuoShuiDiaoYan'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 781)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 781)
  },
  components: {
    PremiumSubject,
    HotMsgs
  },
  head () {
    return {
      title: `涨价早知道 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '涨价早知道更新'
      }
    }
  }
}
</script>
