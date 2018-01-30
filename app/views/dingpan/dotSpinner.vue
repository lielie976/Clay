<template>
  <div class="dot-spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script>
  export default {
    name: 'DotSpinner'
  }
</script>

<style lang="less" scoped>
.dot-spinner {
  margin: 0 auto;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dot-spinner > div {
  width: 8px;
  height: 8px;
  background-color: #e6394d;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.dot-spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.dot-spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
