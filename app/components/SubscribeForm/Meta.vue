<template>
  <div class="subscribe-form-meta">
    <template v-if="subject">
      <img class="subscribe-form-meta-image" :src="subject.Image"  />
      <div class="subscribe-form-meta-info">
        <h2>{{subject.Title}}</h2>
        <div class="subscribe-form-meta-info-time">
          <span class="subscribe-form-meta-info-time-header">订阅时长： </span>
          <span class="subscribe-form-meta-info-time-content">2017/11/20-2019/11/20</span>
        </div>
        <div class="subscribe-form-meta-info-price">
          <span class="subscribe-form-meta-info-price-header">总额</span>
          <span class="subscribe-form-meta-info-price-content">￥3916.80</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    subject: Object
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form-meta {
  display: flex;
  padding-bottom: 16px;
  border-bottom: 2px dashed #ccc;
  &-image {
    width: 96px;
    height: 96px;
  }
  &-info {
    padding: 0 16px;
    h2 {
      font-size: 20px;
      color: @mainFontColor;
      line-height: 1;
      margin-top: 6px;
    }
    &-time {
      line-height: 1;
      margin: 12px 0 12px;
    }
    &-time-header {
      font-size: 14px;
      color: @subFontColor;
    }
    &-time-content {
      font-size: 12px;
      color: #999;
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
      color: #e6394d;
      line-height: 1;
      vertical-align: middle;
    }
  }
}
</style>

