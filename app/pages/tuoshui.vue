<template>
  <tuo-shui />
</template>

<script>
import TuoShui from '~/views/tuoshui'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('homeMsgs/getMsgs')
    await store.dispatch('tuoshui/getInfo')
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
