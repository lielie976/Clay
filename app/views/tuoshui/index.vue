<template>
  <div>
    <div class="tuoshui-meta-container">
      <premium-subject-meta :subject="subject" />
    </div>
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="data.trialMsgs" />
        <msg-list :msgs="data.Messages" :data="data" />
      </section>
      <section class="main-container-right">
        <aside-bought-msgs :msgs="data.Messages" />
        <hot-msgs :msgs="data.Messages" />
      </section>
    </section>
  </div>
</template>

<script>
import PremiumSubjectMeta from '~/components/PremiumSubject/Meta'
import TrialMsgs from '~/components/TrialMsgs'
import AsideBoughtMsgs from '~/components/BoughtMsgs/AsideBoughtMsgs'
import MsgList from './MsgList'
import HotMsgs from './HotMsgs'

export default {
  components: {
    PremiumSubjectMeta,
    MsgList,
    TrialMsgs,
    AsideBoughtMsgs,
    HotMsgs
  },
  computed: {
    data () {
      return this.$store.state.tuoshui
    },
    subject () {
      return {
        ...this.data.Subject,
        Title: 'A股脱水研报',
        Specialty: this.data.Subject.Specialty.replace(/\n/g, '\n\n'),
        slogan: '每天6分钟，每天6元起，基金经理都在看的全球研报精华'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
.tuoshui-meta-container {
  background: url('/img/tuoshui-banner.jpg') no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}
</style>

