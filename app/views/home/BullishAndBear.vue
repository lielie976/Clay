<template>
  <span
    v-if="msg.Impact"
    :class="{
      'bullish-and-bear': true,
      'bullish': isBullish,
      'bear': isBear
    }"
  >
    <template v-if="isSuper">超级</template>
    <template v-if="isBullish">利好</template>
    <template v-if="isBear">利空</template>
  </span>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object
    }
  },
  computed: {
    isBullish () {
      return this.msg.Impact && this.msg.Impact > 0
    },
    isBear () {
      return this.msg.Impact && this.msg.Impact < 0
    },
    isSuper () {
      return this.msg.Impact && Math.abs(this.msg.Impact) === 2
    }
  }
}
</script>

<style lang="less" scoped>
.bullish-and-bear {
  padding: 5px;
  color: #fff;
  font-size: 13px;
  margin-left: 3px;
  vertical-align: middle;
  white-space: nowrap;
  &.bullish {
    background: #E6394D;
  }
  &.bear {
    background: #18A66B;
  }
}
</style>

