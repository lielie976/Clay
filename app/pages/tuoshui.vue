<template>
  <!-- <tuo-shui /> -->
  <premium-subject
    :customization="customization"
  >
    <HotMsgs slot="hotMsgs" />
  </premium-subject>
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import HotMsgs from '~/components/HotMsgs/TuoShui'
import TuoShui from '~/views/tuoshui'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/getInfo', 581)
  },
  components: {
    TuoShui,
    PremiumSubject,
    HotMsgs
  },
  head () {
    return {
      title: `脱水研报 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '研报更新'
      }
    }
  }
}
</script>
