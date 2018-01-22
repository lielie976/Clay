<template>
  <zao-zhi-dao :data="data" />
</template>

<script>
import { getSubject } from '~/api/subject'
import ZaoZhiDao from '~/views/zaozhidao'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await store.dispatch('homeMsgs/getMsgs')
    const data = await getSubject(679, { limit: 20 })
    return {
      data
    }
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
