<template>
  <li class="bought-msgs-item">
    <a :href="`/premium-article/${msg.id}`" target="_blank">{{msg.title}}</a>
    <p class="bought-msgs-item-bottom">
      <span class="bought-msgs-item-subj">
        <img src="/img/tuoshui-banner.jpg">
        只做龙头
      </span>
      <span class="bought-msgs-item-time">
        <time-widget :time="msg.created_at" />
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
.bought-msgs-item {
  padding: 16px 24px 16px 0;
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
