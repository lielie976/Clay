<template>
  <widget-box title="盘中突发热文" v-if="msgs && msgs.length">
    <premium-subject-hot-msgs :msgs="msgs" />
  </widget-box>
</template>

<script>
import PremiumSubjectHotMsgs from '~/components/PremiumSubject/HotMsgs'
import WidgetBox from '~/components/WidgetBox'

export default {
  components: {
    PremiumSubjectHotMsgs,
    WidgetBox
  },
  computed: {
    msgs () {
      return this.$store.state.premiumHotMsgs[779]
    }
  }
}
</script>
