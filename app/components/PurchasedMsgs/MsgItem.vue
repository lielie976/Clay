<template>
  <li class="purchased-msgs-item">
    <a :href="`/premium-article/${msg.Id}`" target="_blank">{{msg.Title}}</a>
    <p class="purchased-msgs-item-bottom">
      <span class="purchased-msgs-item-subj">
        <img src="/img/tuoshui-banner.jpg">
        只做龙头
      </span>
      <span class="purchased-msgs-item-time">
        <time-widget :time="msg.CreatedAt" />
      </span>
    </p>
  </li>
</template>

<script>
import TimeWidget from '~/components/TimeWidget'

export default {
  components: {
    TimeWidget
  },
  props: {
    msg: Object
  }
}
</script>

<style lang="less" scoped>
.purchased-msgs-item {
  padding: 16px 24px 16px 0;
  a {
    font-weight: 500;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
  &-bottom {
    overflow: hidden;
    margin-top: 12px;
    line-height: 20px;
  }
  &-subj {
    float: left;
    font-size: 14px;
    color: #666;
    img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  &-time {
    float: right;
  }
}
</style>
