<template>
  <div class="home-news-titlebar-remind-container" @click="e => e.stopPropagation()">
    <span class="home-news-titlebar-remind-switch" @click="() => setSettingsStatus(true)">
      <i id="home-news-titlebar-remind-switch" :class="{
        'iconfont': true,
        [settingsIcon]: true
      }"></i>
      通知设置
    </span>
    <div :class="{
      'home-news-titlebar-remind-switch-container': true,
      'is-active': data.pushSettingsOpen
    }">
      <div class="home-news-titlebar-remind-switch-audio">
        <span>桌面提醒</span>
        <input
          type="checkbox"
          class="switch-ui"
          id="home-news-notification-switch"
          :checked="getPushStatus('notification')"
          @change="e => setPush({ value: e.target.checked, type: 'notification' })"
        >
        <label for="home-news-notification-switch">
          <span></span><span></span>
        </label>
        <i class="iconfont icon-zhuomiantixing"></i>
      </div>
      <div class="home-news-titlebar-remind-switch-notification">
        <span>声音提示</span>
        <input
          type="checkbox"
          class="switch-ui"
          id="home-news-audio-switch"
          :checked="getPushStatus('audio')"
          @change="e => setPush({ value: e.target.checked, type: 'audio' })"
        >
        <label for="home-news-audio-switch">
          <span></span><span></span>
        </label>
        <i class="iconfont icon-shengyintishi"></i>
      </div>
      <div class="home-news-titlebar-remind-switch-tts">
        <span>语音播报</span>
        <input
          type="checkbox"
          class="switch-ui"
          id="home-news-tts-switch"
          :checked="getPushStatus('tts')"
          @change="e => setPush({ value: e.target.checked, type: 'tts' })"
        >
        <label for="home-news-tts-switch">
          <span></span><span></span>
        </label>
        <i class="iconfont icon-yuyin"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {

  },
  computed: {
    data () {
      return this.$store.state.homeMsgs
    },
    settingsIcon () {
      const push = this.$store.state.homeMsgs.push
      if (push && Object.keys(push).map((key) => push[key]).filter(i => !!i).length) {
        return 'iconfont icon-tongzhi checked'
      } else {
        return 'iconfont icon-guanbitongzhi1'
      }
    }
  },
  methods: {
    ...mapActions({
      setSettingsStatus: 'homeMsgs/setSettingsStatus',
      setPush: 'homeMsgs/setPush',
      initPush: 'homeMsgs/initPush'
    }),
    getPushStatus (type) {
      return this.data.push[type]
    }
  },
  mounted () {
    this.initPush()
    document.addEventListener('click', () => {
      if (!this.$store.state.homeMsgs.pushSettingsOpen) return
      this.setSettingsStatus(false)
    })
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables.less";

.home-news-titlebar {
  &-remind-container {
    position: relative;
    float: right;
  }
  &-remind-switch-container {
    display: none;
    position: absolute;
    top: 29px;
    right: -22px;
    width: 144px;
    height: 129px;
    padding: 0 12px;
    font-size: 14px;
    background: #fff;
    border: 1px solid #E6E6E6;
    box-shadow: 0 0 12px 0 rgba(53, 58, 71, 0.2);
    z-index: 100;
    &.is-active {
      display: block;
    }
    * {
      vertical-align: middle;
    }
    &:before {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      top: -10px;
      left: 50%;
      border: 5px solid #fff;
      border-left-color: transparent;
      border-right-color: transparent;
      border-top-color: transparent;
    }
  }
  &-remind-switch {
    float: right;
    font-size: 12px;
    color: @fc-gray;
    margin-right: 20px;
    position: relative;
    top: -5px;
    cursor: pointer;
    i {
      font-size: 20px;
      margin-left: 3px;
      position: relative;
      top: 3px;
      color: #666;
      &.checked {
        color: @mainColorRed;
      }
    }
  }
  .home-news-titlebar-remind-switch-audio {
    position: relative;
    height: 43px;
    line-height: 43px;
    padding-left: 20px;
  }
  .home-news-titlebar-remind-switch-notification {
    position: relative;
    height: 43px;
    line-height: 43px;
    padding-left: 20px;
    border: 1px solid #efefef;
    border-left: none;
    border-right: none;
  }
  .home-news-titlebar-remind-switch-tts {
    position: relative;
    height: 43px;
    line-height: 43px;
    padding-left: 20px;
  }
}

.switch-ui {
  display: none;
  position: relative;
  & + label {
    display: inline-block;
    position: relative;
    width: 32px;
    height: 16px;
    line-height: 16px;
    margin-left: 4px;
    border-radius: 8px;
    transition: 0.4s;
    overflow: hidden;
    cursor: pointer;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 16px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      transition: 0.4s;
      border: 1px solid #dcdcdc;
    }
    span {
      position: absolute;
      display: inline-block;
      width: 32px;
      height: 16px;
      transition: 0.4s;
    }
    & span:first-child {
      position: absolute;
      background: #E6394D;
      top: 0;
      left: -32px;
    }
    & span:last-child {
      background: #dcdcdc;
      top: 0;
      left: 0;
    }
  }
  & ~ .iconfont {
    position: absolute;
    top: 0;
    left: 0;
  }
  &:checked + label:after {
    right: 0;
    border-color: #E6394D;
  }
  &:checked + label span:first-child {
    left: 0;
  }
  &:checked + label span:last-child {
    left: 32px;
  }
  &:checked ~ .iconfont {
    color: #E6394D;
  }
}
</style>
