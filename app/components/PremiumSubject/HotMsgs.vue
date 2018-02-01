<template>
  <ul class="premium-subject-hot-list">
    <li v-for="(msg, index) in msgs" :key="msg.Id" :class="['premium-subject-hot-list-item', `${index < 3 && 'main'}`]">
      <a :href="`/article/${msg.Id}`" target="_blank"  class="premium-subject-hot-list-item-title">
        <i :class="{iconfont: true, [`icon-0${index + 1}`]: true}"></i>
        {{msg.Title}}
      </a>
      <p class="premium-subject-hot-list-item-time">
        <time-widget :time="msg.CreatedAt" />
      </p>
    </li>
  </ul>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import TimeWidget from '~/components/TimeWidget'

export default {
  props: {
    msgs: Array
  },
  components: {
    WidgetBox,
    TimeWidget
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.premium-subject-hot-list {
  background-color: #fff;
  padding-left: 16px;
  margin-top: 8px;
  &-item {
    padding: 16px 24px 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid #efefef;
    }
    &.main {
      .iconfont {
        color: @subRiseColor;
      }
    }
    .iconfont {
      color: #d8d8d8;
    }
    &-title {
      display: block;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
    }
    &-time {
      text-align: right;
    }
  }
}
</style>
