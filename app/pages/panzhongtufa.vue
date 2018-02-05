<template>
  <premium-subject :customization="customization" />
</template>

<script>
import PremiumSubject from '~/components/PremiumSubject'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('premium/init', 779)
    await store.dispatch('purchasedMsgs/getPurchasedMsgs')
  },
  components: {
    PremiumSubject
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
