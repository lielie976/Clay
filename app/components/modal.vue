<template>
  <div :class="{'is-active':show, 'login-modal':loginSpecialCss}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<script>
  export default {
    props: ['show', 'loginSpecialCss']
  }
</script>
<style lang="less" scoped>
.modal{
  z-index: 200;
}
.login-modal .modal-content{
  overflow: hidden;
  width: 440px;
  margin: 0 20px;
  .modal-close{
    position: absolute;
    z-index: 100;
    top: 10px;
    right: 10px;
  }
}
</style>
<<<<<<< HEAD

=======
>>>>>>> feature/premium
