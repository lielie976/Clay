<template>
  <div class="subscribe-form">
    <div class="subscribe-form-header">确认订单</div>
    <i class="iconfont icon-guanbiduihuakuang subscribe-form-close" @click="onClose"></i>
    <form-meta :data="data" />
    <div class="subscribe-form-options">
      <payment :data="data" />
    </div>
    <p class="subscribe-form-final">账户余额：{{data.balance}} ，{{priceNeededToPay >= 0 ? `直接支付 ${priceNeededToPay} 元` : '优先使用账户余额支付'}}</p>
    <div class="subscribe-form-actions">
      <a class="subscribe-form-actions-pay pay-action-alipay" @click="() => goingToPay(1, 'alipay')"><i class="iconfont icon-zhifubaozhifu"></i>支付宝支付</a>
      <a class="subscribe-form-actions-pay pay-action-wechat" @click="() => goingToPay(1, 'wechat')"><i class="iconfont icon-weixinzhifu"></i>微信支付</a>
      <a class="subscribe-form-actions-pay pay-action-balance" @click="payWithBalance">余额支付</a>
    </div>
    <div class="subscribe-form-privilege">
      <ul>
        <li>订阅特权</li>
        <li>
          <i class="iconfont icon-dingyuetequandingyuefuwu"></i>
          <span>订阅服务期内该主题全部文章免费看</span>
        </li>
        <li>
          <i class="iconfont icon-dingyuetequantongbuchakan"></i>
          <span>APP和PC可同步查看已购买内容</span>
        </li>
      </ul>
    </div>
    <p class="subscribe-form-agreement">购买即表示同意 <a target="_blank" href="/agreement">《选股宝主题订阅协议》</a></p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Payment from './Payment'
import FormMeta from './Meta'

export default {
  components: {
    Payment,
    FormMeta
  },
  props: {
    onClose: Function
  },
  computed: {
    ...mapGetters({
      priceNeededToPay: 'subscribe/priceNeededToPay'
    }),
    data () {
      return this.$store.state.subscribe
    }
  },
  methods: {
    goingToPay (status, method) {
      this.$store.commit('subscribe/changePayStatus', {
        status,
        method
      })
    },
    payWithBalance () {
      this.$store.dispatch('subscribe/payWithBalance')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form {
  position: relative;
  width: 640px;
  height: 500px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
  border: solid 1px #efefef;
  padding: 12px 24px;
  &-header {
    font-size: 14px;
    color: #666666;
    margin-bottom: 8px;
  }
  &-close {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #d8d8d8;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: #999;
    }
  }
  &-options {
    margin-top: 16px;
    
  }
  &-final {
    margin: 16px 0;
    color: #e6394d;
    font-size: 14px;
  }
  &-privilege {
    margin-top: 24px;
    font-size: 13px;
    &-header {
      color: @subFontColor;
    }
    ul {
      display: inline-block;
    }
    li {
      display: inline-block;
      margin-right: 20px;
      color: #666;
      font-size: 12px;
      i {
        display: inline-block;
        font-size: 13px;
        color: #ccc;
      }
      span {
        display: inline-block;
        color: #999;
        font-size: 12px;
        margin-left: 8px;
      }
    }
  }
  &-actions {
    display: flex;
    justify-content: space-between;
    margin: 0 -4px;
    a {
      flex: 1;
      margin: 0 4px;
      height: 48px;
      line-height: 48px;
      text-align: center;
    }
    i {
      display: inline-block;
      margin-top: -2px;
      vertical-align: middle;
      font-size: 20px;
      margin-right: 6px;
    }
    &-pay {
    color: #fff;
    }
    .pay-action-alipay {
      background-color: #4ea7f2;
      flex: 1;
    }
    .pay-action-wechat {
      background-color: #1ec370; 
      flex: 1;
    }
    .pay-action-balance {
      background-color: #e6e6e6;
      flex: 0 0 142px;
    }
  }
  &-agreement {
    margin-top: 16px;
    font-size: 13px;
    color: #999;
    span {
      color: @mainFontColor;
    }
  }
}
</style>

