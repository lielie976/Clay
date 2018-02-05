<template>
  <premium-subject :customization="customization" />
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 781)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
  },
  components: {
    PremiumSubject
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
