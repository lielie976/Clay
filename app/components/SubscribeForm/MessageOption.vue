<template>
  <div :class="{
    'subscribe-message-option': true,
    'selected': selected
  }">
    <div class="subscribe-message-option-day">单篇</div>
    <div class="subscribe-message-option-price">￥18</div>
  </div>
</template>

<script>
export default {
  props: {
    selected: Boolean
  }
}
</script>

<style lang="less" scoped>
.subscribe-message-option {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: solid 1px #efefef;
  padding: 8px 0;
  text-align: center;
  transition: 0.4s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.1);
  }
  &.selected {
    border-color: #e6394d;
    .subscribe-message-option-discount span {
      color: #e6394d;
    }
    &::after {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      border: 10px solid #e6394d;
      border-left-color: transparent;
      border-bottom-color: transparent;
    }
  }
  &-day {
    color: #666;
  }
  &-price {
    color: #e6394d;
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
