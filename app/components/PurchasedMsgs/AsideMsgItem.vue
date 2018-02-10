<template>
  <li class="purchased-msgs-item">
    <a :href="`/article/${msg.Id}`" target="_blank" ref="title" class="purchased-msgs-item-title">{{msg.Title}}</a>
    <p class="purchased-msgs-item-bottom">
      <a class="purchased-msgs-item-subj" :href="`/subject/${msg.Subjects && msg.Subjects[0].Id}`" target="_blank" v-if="msg.Subjects && msg.Subjects[0]">
        <img :src="msg.Subjects && msg.Subjects[0].Image">
        {{msg.Subjects && msg.Subjects[0].Title}}
      </a>
      <span class="purchased-msgs-item-time">
        <time-widget :time="msg.CreatedAt" />
      </span>
    </p>
  </li>
</template>

<script>
import shave from 'shave'
import TimeWidget from '~/components/TimeWidget'

export default {
  components: {
    TimeWidget
  },
  props: {
    msg: Object
  },
  mounted () {
    shave(this.$refs.title, 54)
  }
}
</script>

<style lang="less" scoped>
.purchased-msgs-item {
  padding: 16px 24px 16px 0;
  &-title {
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
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
