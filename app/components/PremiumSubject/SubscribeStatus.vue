<template>
  <div class="subscribe-status">
    <template v-if="data.IsSubscribed && data.RemainingDays > 0">
      <p class="subscribe-status-remaindate">只剩<span>{{data.RemainingDays}}</span>天</p>
      <p class="subscribe-status-validdate">有效期：{{validDate(data.RemainingDays)}}</p>
      <a class="subscribe-status-action" @click="toggleModal">我要续订</a>
    </template>
    <template v-else>
      <p class="subscribe-status-price"><small id="rmb">￥</small>{{minimumPrice}} <small>起</small></p>
      <p class="subscribe-status-discount">包年/月/年立省 {{maximumDiscount | toFixed(2)}}</p>
      <a class="subscribe-status-action" @click="toggleModal">我要订阅</a>
    </template>
  </div>
</template>

<script>
import { getDuration, formatDate } from '~/utils/helpers'

export default {
  props: {
    data: Object
  },
  methods: {
    toggleModal () {
      this.$store.dispatch('subscribe/toggleModal')
    },
    validDate (days) {
      return formatDate(getDuration(days), 'YYYY/MM/DD')
    }
  },
  computed: {
    minimumPrice () {
      if (!this.data.SubscribeItems.length) return
      return this.data.SubscribeItems[0].DiscountPrice
    },
    maximumDiscount () {
      if (!this.data.SubscribeItems.length) return
      const max = this.data.SubscribeItems[this.data.SubscribeItems.length - 1]
      return max.OriginPrice - max.DiscountPrice
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-status {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  &-price {
    font-size: 36px;
    line-height: 36px;
    color: #f2564e;
    small {
      font-size: 20px;
      color: #ccc;
      &#rmb {
        color: #f2564e;
      }
    }
  }
  &-discount {
    font-size: 14px;
    margin: 8px 0 24px;
  }
  &-action {
    width: 256px;
    height: 48px;
    line-height: 48px;
    background-image: linear-gradient(to right, #f2564e, #e6394d);
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin-top: 24px;
  }
  &-validdate {
    font-size: 20px;
    color: #999999;
  }
  &-remaindate {
    font-size: 18px;
    color: #f2564e;
    margin-bottom: 18px;
    span {
      display: inline-block;
      margin: 0 8px;
      font-size: 48px;
      line-height: 1;
    }
  }
}
</style>
