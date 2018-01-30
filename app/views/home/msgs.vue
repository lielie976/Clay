<template>
  <div>
    <ul class="home-news-container" @copy="handleCopy">
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
// import Mytip from '~/services/notification'
import Push from 'push.js'
import readFromBaidu from '~/services/baiduTTS'
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
    },
    homeMsgs () {
      return this.$store.state.homeMsgs
    }
  },
  methods: {
    loadMore () {
      this.$store.dispatch('homeMsgs/loadMore')
    },
    handleCopy () {
      const selection = window.getSelection()
      const appendText = `<br>(选股宝7×24直播 不止是快) <a href="https://xuangubao.cn">https://xuangubao.cn</a>`
      const text = selection + appendText
      const newDiv = document.createElement('div')
      document.body.appendChild(newDiv)
      newDiv.style.position = 'absolute'
      newDiv.style.left = '-99999px'
      newDiv.innerHTML = text
      selection.selectAllChildren(newDiv)
      setTimeout(function () {
        document.body.removeChild(newDiv)
      }, 100)
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.$store.dispatch('homeMsgs/refreshMsgs').then((res) => {
        if (!res.NewMsgs) return
        if (this.homeMsgs.push.tts) {
          const newMsgsTitle = res.NewMsgs.map((i) => {
            const hour = new Date(i.CreatedAtInSec * 1000).getHours()
            const minute = new Date(i.CreatedAtInSec * 1000).getMinutes()
            return `${hour}点${minute}分 ${i.Title} `
          }).join(' ')
          readFromBaidu(newMsgsTitle, this.$store.state.external.baiduTTSToken.Token)
        }
        if (this.homeMsgs.push.notification) {
          const msg = res.NewMsgs[res.NewMsgs.length - 1]
          Push.create(msg.Title, {
            body: msg.Summary,
            icon: 'http://image.bao.wallstreetcn.com/baoer_logo/120x120.png',
            timeout: 10000,
            onClick: function () {
              window.focus()
              this.close()
            }
          })
        }
        if (this.homeMsgs.push.audio) {
          const audio = new Audio('/ringstone/alert.mp3')
          audio.play()
        }
      })
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

