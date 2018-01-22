<template>
  <zao-zhi-dao />
</template>

<script>
import ZaoZhiDao from '~/views/zaozhidao'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('zaozhidao/getInfo')
  },
  components: {
    ZaoZhiDao
  },
  head () {
    return {
      title: `机会早知道 | ${texts.slogan}`
    }
  }
}
</script>
