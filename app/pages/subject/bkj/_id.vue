<template>
  <subject
    :title="title"
    :msgs="msgs"
    :bkj="bkj"
    :loadMore="getData"
  />
</template>

<script>
import Subject from '~/views/subject'
import { getBkjLinkedSubject } from '~/api/bkj'
import texts from '~/utils/texts'

export default {
  async asyncData ({ params }) {
    const data = await getBkjLinkedSubject(params.id, { limit: 20 })
    return {
      data,
      id: params.id
    }
  },
  head () {
    return {
      title: `${this.data.BkjName} | ${texts.slogan}`
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
        TailMark: this.data.TailMark,
        limit: 20
      }
    },
    title () {
      return this.data.BkjName
    },
    msgs () {
      return this.data.Messages
    },
    bkj () {
      return [{
        Name: this.data.BkjName,
        Id: this.data.BkjId
      }]
    }
  },
  methods: {
    getData () {
      if (this.loading) return
      this.loading = true
      getBkjLinkedSubject(this.id, this.params).then((res) => {
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
</script>
