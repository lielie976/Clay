<template>
  <div>
    <div class="meta-container" >
      <div class="meta-bg" :style="{'background-image': `url(${this.subscribeStore.subject.PcImage})`}">
      </div>
      <premium-subject-meta :subject="subscribeStore.subject" />
    </div>
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="data.trialMsgs" />
        <widget-box :title="customization.msgListTitle">
          <msg-list :msgs="data.msgs" :data="data" />
        </widget-box>
      </section>
      <section class="main-container-right">
        <aside-purchased-msgs :msgs="purchasedMsgs" />
        <hot-msgs />
      </section>
    </section>
  </div>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import TrialMsgs from '~/components/TrialMsgs'
import AsidePurchasedMsgs from '~/components/PurchasedMsgs/AsidePurchasedMsgs'
import PremiumSubjectMeta from './Meta'
import MsgList from './MsgList'
import HotMsgs from './HotMsgs'

export default {
  components: {
    WidgetBox,
    PremiumSubjectMeta,
    MsgList,
    TrialMsgs,
    AsidePurchasedMsgs,
    HotMsgs
  },
  computed: {
    data () {
      return this.$store.state.premium
    },
    subscribeStore () {
      return this.$store.state.subscribe
    },
    purchasedMsgs () {
      return this.$store.state.purchasedMsgs.msgs
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
  position: relative;
  overflow: hidden;
}
.meta-bg {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
  min-height: 296px;
  min-width: 1200px;
  width: 100%;
  height: 110%;
  position: absolute;
  filter: blur(5px);
  margin: -5px -5px;
}
</style>

