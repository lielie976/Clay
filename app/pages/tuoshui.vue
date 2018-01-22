<template>
  <tuo-shui :data="data" />
</template>

<script>
import { getSubject } from '~/api/subject'
import TuoShui from '~/views/tuoshui'
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
    TuoShui
  },
  head () {
    return {
      title: `脱水研报 | ${texts.slogan}`
    }
  }
}
</script>
