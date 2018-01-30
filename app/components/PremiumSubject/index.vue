<template>
  <div>
    <div class="meta-container" :style="{'background-image': `url(${this.data.subjectInfo.PcImage})`}">
      <premium-subject-meta :subject="data.subjectInfo" />
    </div>
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="data.trialMsgs" />
        <widget-box :title="customization.msgListTitle">
          <msg-list :msgs="data.msgs" :data="data" />
        </widget-box>
      </section>
      <section class="main-container-right">
        <aside-bought-msgs :msgs="boughtMsgs" />
        <slot name="hotMsgs"></slot>
      </section>
    </section>
    
  </div>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import PremiumSubjectMeta from '~/components/PremiumSubject/Meta'
import TrialMsgs from '~/components/TrialMsgs'
import AsideBoughtMsgs from '~/components/BoughtMsgs/AsideBoughtMsgs'
import MsgList from '~/components/PremiumSubject/MsgList'

export default {
  components: {
    WidgetBox,
    PremiumSubjectMeta,
    MsgList,
    TrialMsgs,
    AsideBoughtMsgs
  },
  computed: {
    data () {
      return this.$store.state.premium
    },
    boughtMsgs () {
      return this.$store.state.boughtMsgs.msgs
    }
  },
  props: {
    customization: Object
  }
}
</script>

<style lang="less" scoped>
.main-container {
  margin: 24px auto;
}
.meta-container {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}
</style>

