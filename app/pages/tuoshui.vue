<template>
  <div>
    <premium-subject-meta :subject="subject" />
  </div>
</template>

<script>
import { getSubject } from '~/api/subject'
import PremiumSubjectMeta from '~/components/PremiumSubject/Meta'

export default {
  async asyncData () {
    const data = await getSubject(581, { limit: 20 })
    return {
      data
    }
  },
  components: {
    PremiumSubjectMeta
  },
  computed: {
    subject () {
      return {
        ...this.data.Subject,
        Title: 'A股脱水研报',
        slogan: '每天6分钟，每天6元起，基金经理都在看的全球研报精华'
      }
    }
  }
}
</script>
