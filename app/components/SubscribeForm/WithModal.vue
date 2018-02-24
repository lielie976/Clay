<template>
  <modal
    :active="subscribeStore.isModalOpen"
    :toggleModal="toggleModal"
  >
    <subscribe-form
      v-if="isOpen(0)"
      :onClose="toggleModal"
      :data="subscribeStore"
    />
    <paying
      v-if="isOpen(1)"
      :onClose="toggleModal"
      :data="subscribeStore"
    />
    <success
      v-if="isOpen(2)"
      :onClose="toggleModal"
      :data="subscribeStore"
    />
    <fail
      v-if="isOpen(3)"
      :onClose="toggleModal"
      :data="subscribeStore"
    />
  </modal>
</template>

<script>
import URI from 'urijs'
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
    subscribeStore () {
      return this.$store.state.subscribe
    }
  },
  methods: {
    toggleModal () {
      this.$store.dispatch('subscribe/toggleModal')
    },
    isOpen (status) {
      return this.subscribeStore.isModalOpen && this.subscribeStore.payStatus === status
    }
  },
  mounted () {
    const { openSubscribe } = URI(location.href).search(true)
    if (openSubscribe) this.$store.dispatch('subscribe/toggleModal')
  }
}
</script>
