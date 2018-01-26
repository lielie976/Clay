<template>
  <div :class="['modal', `${isModalOpen ? 'is-active' : ''}`]">
    <div class="modal-background" @click="toggleModal"></div>
    <div class="modal-content">
      <subscribe-form
        :subject="subject"
        :onClose="toggleModal"
      />
    </div>
    <!-- <button class="modal-close is-large" aria-label="close" @click="toggleModal"></button> -->
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
  },
  computed: {
    isModalOpen () {
      return this.$store.state.subscribe.isModalOpen
    }
  },
  methods: {
    toggleModal () {
      this.$store.commit('subscribe/toggleModal')
    }
  }
}
</script>
