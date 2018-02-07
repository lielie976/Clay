<template>
  <div :class="{
    'subscribe-subject-option': true,
    'selected': selected
  }"
    @click="select"
  >
    <div class="subscribe-subject-option-day">{{item.Name}}</div>
    <div class="subscribe-subject-option-price"><small>￥</small>{{item.DiscountPrice}}</div>
    <div class="subscribe-subject-option-discount">立省<span>{{(item.OriginPrice - item.DiscountPrice) | toFixed(2)}}</span></div>
    <div class="subscribe-subject-option-badge"></div>
  </div>
</template>

<script>
export default {
  props: {
    select: Function,
    item: Object,
    index: Number,
    data: Object
  },
  computed: {
    selected () {
      return (
        this.data.selectedType === 'subject' &&
        this.index === this.data.subjectItems.index
      )
    }
  }
}
</script>

<style lang="less" scoped>
.subscribe-subject-option {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border: solid 1px #efefef;
  padding: 8px 0;
  text-align: center;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.1);
  }
  &.selected {
    border-color: #e6394d;
    .subscribe-subject-option-discount span {
      color: #e6394d;
    }
    .subscribe-subject-option-badge {
      position: absolute;
      top: 0;
      right: 0;
      border: 10px solid #e6394d;
      border-left-color: transparent;
      border-bottom-color: transparent;
      &::before {
        content: '';
        position: absolute;
        top: -4px;
        right: -5px;
        width: 5px;
        height: 1px;
        background-color: #fff;
        transform: rotate(45deg);
      }
      &::after {
        content: '';
        position: absolute;
        top: -5px;
        right: -9px;
        width: 6px;
        height: 1px;
        background-color: #fff;
        transform: rotate(-45deg);
      }
    }
  }
  &-day {
    color: #666;
  }
  &-price {
    color: #e6394d;
    font-size: 20px;
    line-height: 1;
    margin: 3px 0;
    small {
      font-size: 14px;
    }
  }
  &-discount {
    color: #999;
    font-size: 14px;
  }
}
</style>
