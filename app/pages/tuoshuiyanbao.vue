<template>
  <premium-subject :customization="customization">
    <HotMsgs slot="hotMsgs" />
  </premium-subject>
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import HotMsgs from '~/components/HotMsgs/TuoShuiYanBao'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 581)
    await store.dispatch('boughtMsgs/getBoughtMsgs')
    await store.dispatch('premiumHotMsgs/getHotMsgs', 581)
  },
  components: {
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
