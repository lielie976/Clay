<template>
  <div>
    <ul class="home-news-container">
      <msg
        v-for="msg in msgs"
        :key="msg.Id"
        :msg="msg"
      />
    </ul>
    <div class="home-news-loadmore" @click="loadMore">
      <span class="home-news-loadmore-text">点击加载更多</span>
    </div>
  </div>
</template>

<script>
import Msg from './Msg'

function checkIfMsgCrossDay (msgs) {
  return msgs.map((msg, index) => {
    if (index === 0) {
      return {
        ...msg,
        dayLast: true
      }
    }
    if (new Date(msg.CreatedAtInSec * 1000).getDay() !== new Date(msgs[index - 1].CreatedAtInSec * 1000).getDay()) {
      return {
        ...msg,
        dayLast: true
      }
    }
    return msg
  })
}

export default {
  components: {
    Msg
  },
  computed: {
    msgs () {
      let msgs = this.$store.state.homeMsgs.msgs
      msgs = checkIfMsgCrossDay(msgs)
      return msgs
    }
  },
  methods: {
    loadMore () {
      this.$store.dispatch('homeMsgs/loadMore')
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.$store.dispatch('homeMsgs/refreshMsgs')
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.home-news-container {
  padding-top: 30px;
  background: #fff;
}
.home-news-loadmore {
  display: block;
  margin-top: 16px;
  background: #fff;
  height: 45px;
  text-align: center;
  cursor: pointer;
  &-text {
    line-height: 45px;
    font-size: 16px;
    position: relative;
    &:before {
      content: "\e639";
      font-family: "iconfont";
      position: absolute;
      left: -25px;
    }
  }
}
</style>

