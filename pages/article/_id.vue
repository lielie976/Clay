<template>
  <div>
    <h1>{{ msg.Title }}</h1>
    <div v-html="msg.Content"></div>
  </div>
</template>

<script>
import { getMessage } from '~/api/message'

export default {
  async asyncData ({ params }) {
    const msg = await getMessage(params.id)
    return { msg }
  }
}
</script>
