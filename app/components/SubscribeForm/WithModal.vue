<template>
  <div class="modal">
  <!-- is-active -->
    <div class="modal-background"></div>
    <div class="modal-content">
      <subscribe-form :subject="subject" />
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
  </div>
</template>

<script>
import SubscribeForm from './Form'

export default {
  components: {
    SubscribeForm
  },
  props: {
    subject: Object
  }
}
</script>
