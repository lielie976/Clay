<template>
  <premium-subject :customization="customization" />
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 679)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
  },
  components: {
    PremiumSubject
  },
  head () {
    return {
      title: `选股宝早知道 | ${texts.slogan}`
    }
  },
  data () {
    return {
      customization: {
        msgListTitle: '选股宝早知道更新'
      }
    }
  }
}
</script>
