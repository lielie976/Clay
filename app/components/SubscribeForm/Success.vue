<template>
  <sub-form :data="data" :hasHeader="false" :hasFooter="false" :onClose="onClose">
    <div class="subscribe-success">
      <p class="subscribe-success-icon">
        <i class="iconfont icon-dingyuechenggong"></i>
      </p>
      <p class="subscribe-success-text">恭喜！支付成功</p>
      <p class="subscribe-success-timer">{{time}}s 后返回主题主页</p>
      <a class="subscribe-success-check" @click="refresh">立即查看</a>
      <p class="subscribe-success-balance">账户余额：{{data.balance | toFixed(2)}}</p>
    </div>
  </sub-form>
</template>

<script>
import SubForm from './SubForm'

export default {
  components: { SubForm },
  props: {
    data: Object,
    onClose: Function
  },
  data () {
    return {
      time: 3
    }
  },
  methods: {
    refresh () {
      window.location.reload()
    }
  },
  mounted () {
    setInterval(() => {
      if (this.time < 1) {
        location.reload()
      } else {
        this.time -= 1
      }
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-success {
  text-align: center;
  &-icon {
    margin-top: 56px;
    line-height: 1;
    i {
      font-size: 64px;
      color: @strongFontColor;
    }
  }
  &-text {
    font-size: 18px;
    color: @subFontColor;
    margin: 16px 0 12px;
  }
  &-timer {
    font-size: 12px;
    color: #999;
  }
  &-check {
    display: block;
    color: #fff;
    width: 360px;
    height: 48px;
    line-height: 48px;
    margin: 58px 0 24px;
    text-align: center;
    background-color: #e6394d;
  }
  &-balance {
    font-size: 14px;
    color: @subFontColor;
  }
}
</style>
