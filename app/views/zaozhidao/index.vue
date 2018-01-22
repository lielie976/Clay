<template>
  <div>
    <div class="zzd-meta-container">
      <premium-subject-meta :subject="subject" />
    </div>
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="trialMsgs" />
        <widget-box title="早知道更新">
          <msg-list :msgs="$store.state.homeMsgs.msgs" />
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
  props: {
    data: Object
  },
  computed: {
    subject () {
      console.log(this.data.Subject)
      return {
        ...this.data.Subject,
        Title: 'A股主题早知道',
        Specialty: this.data.Subject.Specialty.replace(/\n/g, '\n\n'),
        slogan: '为人不识早知道，炒遍A股也枉然！'
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
.zzd-meta-container {
  background: url('/img/zaozhidao-banner.jpg') no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}
</style>

