<template>
  <div :class="['modal', `${active ? 'is-active' : ''}`]">
    <div class="modal-background" @click="toggleModal"></div>
    <div class="modal-content">
      <slot />
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
    toggleModal: Function,
    active: Boolean
  }
}
</script>
