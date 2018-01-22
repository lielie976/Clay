<template>
  <div>
    <div class="zaozhidao-meta-container">
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
import WidgetBox from '~/components/WidgetBox'
import AsideBoughtMsgs from '~/components/BoughtMsgs/AsideBoughtMsgs'
import MsgList from './MsgList'
import HotMsgs from './HotMsgs'

export default {
  components: {
    PremiumSubjectMeta,
    TrialMsgs,
    WidgetBox,
    AsideBoughtMsgs,
    HotMsgs,
    MsgList
  },
  computed: {
    data () {
      return this.$store.state.zaozhidao
    },
    subject () {
      return {
        ...this.data.Subject,
        Title: 'A股主题早知道',
        Specialty: this.data.Subject.Specialty.replace(/\n/g, '\n\n'),
        slogan: '为人不识早知道，炒遍A股也枉然！'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
.zaozhidao-meta-container {
  background: url('/img/zaozhidao-banner.jpg') no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}
</style>

