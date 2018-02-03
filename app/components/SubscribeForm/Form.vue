<template>
  <div class="subscribe-form">
    <div class="subscribe-form-header">确认订单</div>
    <i class="iconfont icon-guanbiduihuakuang subscribe-form-close" @click="onClose"></i>
    <form-meta :data="data" :onClose="onClose" />
    <div class="subscribe-form-options">
      <payment :data="data" />
    </div>
    <pay-actions :data="data" />
    <form-footer />
  </div>
</template>

<script>
import Payment from './Payment'
import FormMeta from './Meta'
import FormFooter from './FormFooter'
import PayActions from './PayActions'

export default {
  components: {
    Payment,
    FormMeta,
    FormFooter,
    PayActions
  },
  props: {
    onClose: Function,
    data: Object
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form {
  position: relative;
  width: 640px;
  min-height: 500px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
  border: solid 1px #efefef;
  padding: 12px 24px;
  &-header {
    font-size: 14px;
    color: #666666;
    margin-bottom: 8px;
  }
  &-close {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #d8d8d8;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: #999;
    }
  }
  &-options {
    margin-top: 16px;
  }
}
</style>

