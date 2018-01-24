<template>
  <div>
    <div class="meta-container" :style="{'background-image': `url(${this.data.Subject.Image})`}">
      <premium-subject-meta :subject="data.Subject" />
    </div>
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="data.trialMsgs" />
        <widget-box title="研报更新">
          <msg-list :msgs="data.Messages" :data="data" />
        </widget-box>
      </section>
      <section class="main-container-right">
        <aside-bought-msgs :msgs="data.Messages" />
        <hot-msgs />
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
import HotMsgs from '~/components/HotMsgs/TuoShui'

export default {
  components: {
    WidgetBox,
    PremiumSubjectMeta,
    MsgList,
    TrialMsgs,
    AsideBoughtMsgs,
    HotMsgs
  },
  computed: {
    data () {
      return this.$store.state.premium
    }
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

