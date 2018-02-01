<template>
  <subject
    :title="title"
    :stocks="stocks"
    :msgs="msgs"
    :loadMore="getData"
  />
</template>

<script>
import Subject from '~/views/subject'
import { getSubject } from '~/api/subject'
import texts from '~/utils/texts'
import { redirectPremiumSubject } from '~/utils/constants'

export default {
  async asyncData ({ params, redirect }) {
    redirect(redirectToPremium(params.id))
    const data = await getSubject(params.id, { limit: 20 })
    return {
      data,
      id: params.id
    }
  },
  head () {
    return {
      title: `${this.data.Subject.Title} | ${texts.slogan}`
    }
  },
  components: {
    Subject
  },
  data () {
    return {
      data: {},
      loading: false
    }
  },
  computed: {
    params () {
      return {
        Mark: this.data.NextMark,
        limit: 20
      }
    },
    title () {
      return this.data.Subject.Title
    },
    stocks () {
      let stocks
      try {
        stocks = this.data.Subject.SubjSsetInfo.SsetStocks
      } catch (err) {
        stocks = []
      }
      return stocks
    },
    msgs () {
      return this.data.Messages
    }
  },
  methods: {
    getData () {
      if (this.loading) return
      this.loading = true
      getSubject(this.id, this.params).then((res) => {
        this.data = {
          ...this.data,
          ...res,
          Messages: [...this.data.Messages, ...res.Messages]
        }
        this.loading = false
      })
    }
  }
}

function redirectToPremium (id) {
  return redirectPremiumSubject[id]
}
</script>
