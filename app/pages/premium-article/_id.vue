<template>
  <premium-article :data="data" />
</template>

<script>
import { getMessage } from '~/api/message'
import texts from '~/utils/texts'
import PremiumArticle from '~/views/premium-article'

export default {
  async asyncData ({ params }) {
    const data = await getMessage(params.id)
    return { data }
  },
  head () {
    return {
      title: `${this.data.Title} | ${texts.slogan}`,
      meta: [
        {
          hid: `description`,
          name: 'description',
          content: this.data.Summary
        }
      ]
    }
  },
  components: {
    PremiumArticle
  }
}
</script>
