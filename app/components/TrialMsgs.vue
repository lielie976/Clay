<template>
  <widget-box title="试读文章">
    <ul class="trial-msgs">
      <li
        v-for="msg in msgs"
        :key="msg.Id"
        class="trial-msg"
      >
        <img :src="msg.Title" alt="试读文章配图" class="trial-msg-img">
        <div class="trial-msg-title">
          {{ msg.Title | truncate(20, '...') }}
          <div class="trial-msg-flag">试读</div>
        </div>
      </li>
    </ul>
  </widget-box>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'

export default {
  props: {
    msgs: Array
  },
  components: {
    WidgetBox
  }
}
</script>

<style lang="less" scoped>
.trial-msgs {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
}
.trial-msg {
  display: flex;
  flex: 0 0 272px;
  padding: 8px;
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  &-img {
    flex: 0 0 72px;
    width: 72px;
    height: 72px;
  }
  &-title {
    flex: 1;
    position: relative;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    line-height: 22px;
  }
  &-flag {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 32px;
    height: 16px;
    line-height: 16px;
    background-color: #A6ADBE;
    color: #fff;
    font-size: 12px;
    text-align: center;
  }
}
</style>

