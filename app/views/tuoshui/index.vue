<template>
  <div>
    <premium-subject-meta :subject="subject" />
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="trialMsgs" />
        <widget-box title="研报更新">
          <premium-subject-msg-list :msgs="$store.state.homeMsgs.msgs" />
        </widget-box>
      </section>
      <section class="main-container-right">
        <aside-bought-msgs :msgs="$store.state.homeMsgs.msgs" />
        <hot-msgs :msgs="$store.state.homeMsgs.msgs" />
      </section>
    </section>
  </div>
</template>

<script>
import PremiumSubjectMeta from '~/components/PremiumSubject/Meta'
import PremiumSubjectMsgList from '~/components/PremiumSubject/MsgList'
import TrialMsgs from '~/components/TrialMsgs'
import WidgetBox from '~/components/WidgetBox'
import AsideBoughtMsgs from '~/components/AsideBoughtMsgs'
import HotMsgs from './HotMsgs'

export default {
  components: {
    PremiumSubjectMeta,
    PremiumSubjectMsgList,
    TrialMsgs,
    WidgetBox,
    AsideBoughtMsgs,
    HotMsgs
  },
  props: {
    data: Object
  },
  computed: {
    subject () {
      return {
        ...this.data.Subject,
        Title: 'A股脱水研报',
        Specialty: this.data.Subject.Specialty.replace(/\n/g, '\n\n'),
        slogan: '每天6分钟，每天6元起，基金经理都在看的全球研报精华'
      }
    },
    trialMsgs () {
      return this.$store.state.homeMsgs.msgs.slice(0, 3)
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
</style>

