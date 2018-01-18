<template>
  <div>
    <premium-subject-meta :subject="subject" />
    <section class="main-container">
      <section class="main-container-left">
        <trial-msgs :msgs="trialMsgs" />
        <widget-box title="研报更新">
          <div style="margin-top: 8px">
            <premium-subject-msg-list :msgs="$store.state.homeMsgs.msgs" />
          </div>
        </widget-box>
      </section>
      <section class="main-container-right">
        456
      </section>
    </section>
  </div>
</template>

<script>
import { getSubject } from '~/api/subject'
import PremiumSubjectMeta from '~/components/PremiumSubject/Meta'
import PremiumSubjectMsgList from '~/components/PremiumSubject/MsgList'
import TrialMsgs from '~/components/TrialMsgs'
import WidgetBox from '~/components/WidgetBox'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('homeMsgs/getMsgs')
    const data = await getSubject(581, { limit: 20 })
    return {
      data
    }
  },
  components: {
    PremiumSubjectMeta,
    PremiumSubjectMsgList,
    TrialMsgs,
    WidgetBox
  },
  head () {
    return {
      title: `脱水研报 | ${texts.slogan}`
    }
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

