<template>
  <modal
    :active="isModalOpen"
    :toggleModal="toggleModal"
  >
    <subscribe-form
      v-if="isOpen(0)"
      :onClose="toggleModal"
    />
    <paying
      v-if="isOpen(1)"
      :data="data"
    />
    <success
      v-if="isOpen(2)"
      :data="data"
    />
    <fail
      v-if="isOpen(3)"
      :data="data"
    />
  </modal>
</template>

<script>
import Modal from './Modal'
import SubscribeForm from './Form'
import Paying from './Paying'
import Success from './Success'
import Fail from './Fail'

export default {
  components: {
    Modal,
    SubscribeForm,
    Paying,
    Success,
    Fail
  },
  computed: {
    isModalOpen () {
      return this.$store.state.subscribe.isModalOpen
    },
    data () {
      return this.$store.state.subscribe
    }
  },
  methods: {
    toggleModal () {
      if (this.$store.state.user.userInfo.isLogged) {
        this.$store.commit('subscribe/toggleModal')
      } else {
        this.$store.dispatch('login/showLogin')
      }
    },
    isOpen (status) {
      const subscribeStore = this.$store.state.subscribe
      return subscribeStore.isModalOpen && subscribeStore.payStatus === status
    }
  }
}
</script>
