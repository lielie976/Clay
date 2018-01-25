<template>
  <premium-subject :customization="customization">
    <HotMsgs slot="hotMsgs" />
  </premium-subject>
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import HotMsgs from '~/components/HotMsgs/ZaoZhiDao'
import TuoShui from '~/views/tuoshui'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 679)
    await store.dispatch('boughtMsgs/getBoughtMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 679)
  },
  components: {
    TuoShui,
    PremiumSubject,
    HotMsgs
  },
  head () {
    return {
      title: `机会早知道 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '早知道更新'
      }
    }
  }
}
</script>
