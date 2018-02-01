<template>
  <div class="subscribe-paying">
    <form-meta :data="data" :onClose="onClose" />
    <p v-if="hasHeader" class="subscribe-paying-warning">请在 <span>3</span> 分钟内完成支付，否则订单将被取消</p>
    <slot></slot>
    <p v-if="hasFooter" class="subscribe-paying-service">如有问题，请联系客服 021-xxxxxx</p>
  </div>
</template>

<script>
import FormMeta from './Meta'

export default {
  components: {
    FormMeta
  },
  props: {
    data: Object,
    onClose: Function,
    hasHeader: {
      type: Boolean,
      default: true
    },
    hasFooter: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-paying {
  position: relative;
  width: 408px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
  border: solid 1px #efefef;
  padding: 12px 24px;
  margin: 0 auto;
  &-warning {
    margin: 20px 0;
    text-align: center;
    color: @subFontColor;
    span {
      display: inline-block;
      margin: 0 3px;
      color: @strongFontColor;
    }
  }
  &-service {
    margin: 16px 0;
    text-align: center;
    color: @subFontColor;
    font-size: 14px;
  }
}
</style>

