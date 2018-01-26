<template>
  <div class="payment-options">
    <p class="payment-header">购买选项</p>
    <ul>
      <li><pay-message-option :selected="true" /></li>
      <li><pay-subject-option :selected="true" /></li>
      <li><pay-subject-option /></li>
      <li><pay-subject-option /></li>
    </ul>
  </div>
</template>

<script>
import PaySubjectOption from './PaySubjectOption'
import PayMessageOption from './PayMessageOption'

export default {
  components: {
    PaySubjectOption,
    PayMessageOption
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.payment-options {
  .payment-header {
    color: @subFontColor;
    font-size: 14px;
  }
  ul {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }
  li {
    flex: 1;
    margin: 0 4px;
    max-width: 142px;
    height: 88px;
  }
}
</style>
