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
    await store.dispatch('premium/init', 517)
    await store.dispatch('boughtMsgs/getBoughtMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 517)
  },
  components: {
    PremiumSubject,
    HotMsgs
  },
  head () {
    return {
      title: `脱水调研 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '脱水调研更新'
      }
    }
  }
}
</script>
