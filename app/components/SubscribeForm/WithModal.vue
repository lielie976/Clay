<template>
  <modal
    :active="isModalOpen"
    :toggleModal="toggleModal"
  >
    <subscribe-form
      :onClose="toggleModal"
    />
  </modal>
</template>

<script>
import Modal from './Modal'
import SubscribeForm from './Form'

export default {
  components: {
    Modal,
    SubscribeForm
  },
  computed: {
    isModalOpen () {
      return this.$store.state.subscribe.isModalOpen
    }
  },
  methods: {
    toggleModal () {
      if (this.$store.state.user.userInfo.isLogged) {
        this.$store.commit('subscribe/toggleModal')
      } else {
        this.$store.dispatch('login/showLogin')
      }
    }
  }
}
</script>
