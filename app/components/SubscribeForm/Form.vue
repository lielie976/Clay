<template>
  <div class="subscribe-form">
    <div class="subscribe-form-header">确认订单</div>
    <i class="iconfont icon-guanbiduihuakuang subscribe-form-close" @click="onClose"></i>
    <form-meta :subject="subject" />
    <div class="subscribe-form-options">
      <payment />
    </div>
    <div class="subscribe-form-privilege">
      <p class="subscribe-form-privilege-header">订阅特权</p>
      <ul>
        <li>
          <i class="iconfont icon-quanbu"></i>
          <span>订阅服务期内该主题全部文章免费看</span>
        </li>
        <li>
          <i class="iconfont icon-quanbu"></i>
          <span>APP和PC可同步查看已购买内容</span>
        </li>
      </ul>
    </div>
    <div class="subscribe-form-actions">
      <a class="subscribe-form-actions-pay">立即支付</a>
      <a class="subscribe-form-actions-close">取消</a>
    </div>
    <p class="subscribe-form-agreement">购买即表示同意 <span>《选股宝主题订阅协议》</span></p>
  </div>
</template>

<script>
import Payment from './Payment'
import FormMeta from './Meta'

export default {
  components: {
    Payment,
    FormMeta
  },
  props: {
    subject: Object,
    onClose: Function
  },
  computed: {
    isSubject () {
      return !!this.subject
    },
    data () {
      return this.$store.state.subscribe
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
  }
  &-options {
    margin-top: 16px;
    
  }
  &-privilege {
    margin-top: 24px;
    &-header {
      color: @subFontColor;
      font-size: 14px;
    }
    ul {
      display: inline-block;
    }
    li {
      display: inline-block;
      margin-right: 50px;
      i {
        display: inline-block;
        font-size: 36px;
        color: #ccc;
      }
      span {
        display: inline-block;
        color: @subFontColor;
        font-size: 12px;
        width: 105px;
        margin-left: 8px;
      }
    }
  }
  &-actions {
    display: flex;
    justify-content: space-between;
    a {
      flex: 1;
      margin: 0 4px;
      height: 48px;
      line-height: 48px;
      text-align: center;
    }
    &-pay {
      background-image: linear-gradient(to right, #f2564e, #e6394d);
      color: #fff;
    }
    &-close {
      color: #999;
      border: solid 1px #cccccc;
    }
  }
  &-agreement {
    margin-top: 16px;
    font-size: 14px;
    color: @subFontColor;
    span {
      color: @mainFontColor;
    }
  }
}
</style>

