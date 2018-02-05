<template>
  <widget-box title="精选热文" v-if="msgs && msgs.length">
    <ul class="premium-subject-hot-list">
      <li v-for="(msg, index) in msgs" :key="msg.Id" :class="['premium-subject-hot-list-item', `${index < 3 && 'main'}`]">
        <div class="premium-subject-hot-list-item-meta">
          <i :class="{iconfont: true, [`icon-0${index + 1}`]: true}"></i>
          <a :href="`/article/${msg.Id}`" target="_blank" ref="title" class="premium-subject-hot-list-item-title">
            {{msg.Title}}
          </a>
        </div>
        <p class="premium-subject-hot-list-item-time">
          <time-widget :time="msg.CreatedAt" />
        </p>
      </li>
    </ul>
  </widget-box>
</template>

<script>
import shave from 'shave'
import WidgetBox from '~/components/WidgetBox'
import TimeWidget from '~/components/TimeWidget'

export default {
  components: {
    WidgetBox,
    TimeWidget
  },
  computed: {
    msgs () {
      return this.$store.state.premium.hotMsgs
    }
  },
  mounted () {
    shave(this.$refs.title, 54)
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
    &-meta {
      position: relative;
    }
    .iconfont {
      position: absolute;
      top: 0;
      left: 0;
      color: #d8d8d8;
    }
    &-title {
      display: block;
      text-indent: 1.5em;
      font-size: 16px;
      line-height: 24px;
      max-height: 48px;
      overflow: hidden;
      color: #333333;
    }
    &-time {
      text-align: right;
    }
  }
}
</style>
