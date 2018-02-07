<template>
  <div class="subscribe-form-meta">
    <i class="iconfont icon-guanbiduihuakuang subscribe-form-close" @click="onClose" v-if="data.payStatus !== 0"></i>
    <template v-if="data.selectedType === 'subject'">
      <img class="subscribe-form-meta-image" :src="subject.Image" v-if="subject.Image"  />
      <div class="subscribe-form-meta-info">
        <h2>{{subject.Title}}</h2>
        <template v-if="data.selectedType">
          <div class="subscribe-form-meta-info-time">
            <span class="subscribe-form-meta-info-time-header">订阅时长： </span>
            <span class="subscribe-form-meta-info-time-content">{{subscribeDuration}}</span>
          </div>
          <div class="subscribe-form-meta-info-price">
            <template v-if="data.payStatus === 0">
              <!-- 最开始显示订阅金额 -->
              <span class="subscribe-form-meta-info-price-header">总额</span>
              <span class="subscribe-form-meta-info-price-content">￥{{selectedSubjectItem.DiscountPrice}}</span>
            </template>
            <template v-else-if="data.payStatus === 1">
              <!-- 在支付对话框时显示剩余需要支付的金额 -->
              <span class="subscribe-form-meta-info-price-header">剩余支付</span>
              <span class="subscribe-form-meta-info-price-content">￥{{priceNeededToPay}}</span>
            </template>
            <template v-else>
              <!-- 在成功或者失败时只显示需支付的金额 -->
              <span v-if="priceNeededToPay > 0" class="subscribe-form-meta-info-price-content">￥{{priceNeededToPay}}</span>
            </template>
          </div>
        </template>
      </div>
    </template>
    <template v-else-if="data.selectedType === 'message'">
      <img class="subscribe-form-meta-image" :src="message.Image" v-if="message.Image" />
      <div class="subscribe-form-meta-info">
        <h2 ref="msgTitle">{{message.Title}}</h2>
        <template v-if="data.selectedType">
          <div class="subscribe-form-meta-info-price">
            <template v-if="data.payStatus === 0">
              <span class="subscribe-form-meta-info-price-header">需支付</span>
              <span class="subscribe-form-meta-info-price-content">￥{{message.Price}}</span>
            </template>
            <template v-else-if="data.payStatus === 1">
              <span class="subscribe-form-meta-info-price-header">剩余支付</span>
              <span class="subscribe-form-meta-info-price-content">￥{{priceNeededToPay}}</span>
            </template>
            <template v-else>
              <span v-if="priceNeededToPay > 0" class="subscribe-form-meta-info-price-content">￥{{priceNeededToPay}}</span>
            </template>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import shave from 'shave'

export default {
  props: {
    data: Object,
    onClose: Function
  },
  computed: {
    ...mapGetters({
      selectedSubjectItem: 'subscribe/selectedSubjectItem',
      subscribeDuration: 'subscribe/subscribeDuration',
      priceNeededToPay: 'subscribe/priceNeededToPay'
    }),
    subject () {
      return this.data.subject
    },
    message () {
      return this.data.message
    }
  },
  mounted () {
    if (this.$refs.msgTitle) {
      shave(this.$refs.msgTitle, 54)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form-close {
  position: absolute;
  top: -4px;
  right: -18px;
  color: #d8d8d8;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    color: #999;
  }
}

.subscribe-form-meta {
  position: relative;
  display: flex;
  padding-bottom: 16px;
  border-bottom: 1px dashed #ccc;
  &-image {
    width: 96px;
    height: 96px;
    margin-right: 16px;
  }
  &-info {
    padding-right: 16px;
    h2 {
      font-size: 20px;
      color: @mainFontColor;
      line-height: 27px;
      margin: 4px 0;
    }
    &-time {
      line-height: 1;
      margin: 12px 0 10px;
      color: @strongFontColor;
      font-size: 14px;
    }
    &-price-header {
      display: inline-block;
      font-size: 16px;
      color: @mainFontColor;
      line-height: 1;
      margin-right: 8px;
      vertical-align: middle;
    }
    &-price-content {
      display: inline-block;
      font-size: 25px;
      font-weight: bold;
      color: @strongFontColor;
      line-height: 1;
      vertical-align: middle;
    }
  }
}
</style>

