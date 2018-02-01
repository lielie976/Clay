<template>
  <li class="purchased-msgs-item">
    <a :href="`/article/${msg.Id}`" target="_blank" ref="title">{{msg.Title}}</a>
    <p class="purchased-msgs-item-bottom">
      <a class="purchased-msgs-item-subj" :href="`/subject/${msg.Subjects.Id}`" target="_blank" v-if="msg.Subjects">
        <!-- <img src="/img/tuoshui-banner.jpg"> -->
        {{msg.Subjects.Title}}
      </a>
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
