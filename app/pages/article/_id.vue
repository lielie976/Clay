<template>
  <premium-article :data="data" v-if="isPremium" />
  <article-index :data="data" v-else />
</template>

<script>
import { getMessage } from '~/api/message'
import texts from '~/utils/texts'
import ArticleIndex from '~/views/article'
import PremiumArticle from '~/views/premium-article'
import { redirectPremiumSubject } from '~/utils/constants'

export default {
  async asyncData ({ params, store }) {
    const data = await getMessage(params.id, store.state.auth.headers)
    store.commit('subscribe/saveMessage', data)
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
    ArticleIndex,
    PremiumArticle
  },
  computed: {
    isPremium () {
      if (this.data.FromSubject.IsSubscribable) {
        const keys = Object.keys(redirectPremiumSubject)
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i] === this.data.FromSubject.Id) {
            return true
          }
        }
      }
    }
  }
}
</script>
