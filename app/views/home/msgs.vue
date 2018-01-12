<template>
  <ul>
    <msg v-for="msg in msgs" :key="msg.Id" :msg="msg" />
  </ul>
</template>

<script>
import msg from './msg'

export default {
  components: {
    msg
  },
  computed: {
    msgs () {
      return this.$store.state.home.msgs
    }
  }
}
</script>