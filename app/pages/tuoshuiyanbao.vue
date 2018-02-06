<template>
  <premium-subject :customization="customization" />
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 581)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
  },
  components: {
    PremiumSubject
  },
  head () {
    return {
      title: `脱水研报 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '脱水研报更新'
      }
    }
  }
}
</script>
