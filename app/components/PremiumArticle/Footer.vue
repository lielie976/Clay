<template>
  <footer class="premium-article-footer" v-if="show">
    <section class="main-container">
      <h2 class="premium-article-footer-subject-title">{{subject.Title}}</h2>
      <div class="premium-article-footer-subject-subscribecount">
        <i class="iconfont icon-tarengoumai"></i>
        <span>{{getCNPriceNum(subject.SubscribeCount, true)}}</span>
        <span>订阅</span>
      </div>
      <div class="premium-article-footer-subject-more">
        了解更多<i class="iconfont icon-xiangyou"></i>
      </div>
      <div class="premium-article-footer-subject-subscribe">
        <p>
          <span class="price"><small>¥</small>432.00</span>
          <span class="text">起</span>
        </p>
        <p>
          <span class="text">包年/月/年立省</span>
          <span class="discount">1843.20</span>
        </p>
      </div>
      <div class="premium-article-footer-subject-subscribe-action">
        我要订阅
      </div>
    </section>
    <div class="premium-article-footer-close" @click="show = false">
      <i class="iconfont icon-guanbiduihuakuang"></i>
    </div>
  </footer>
</template>

<script>
import { getCNPriceNum } from '~/utils/helpers'

export default {
  props: {
    subject: Object
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    getCNPriceNum
  }
}
</script>

<style lang="less" scoped>
.premium-article-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #353a47;
  width: 100%;
  height: 64px;
  color: #fff;
  .main-container {
    display: flex;
    align-items: center;
    height: 100%;
  }
  &-subject-title {
    // display: inline-block;
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
  }
  &-subject-subscribecount {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 24px;
      color: #e6394d;
    }
    span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  &-subject-more {
    flex-basis: 500px;
    color: #f2564e;
    font-size: 14px;
    margin-left: 24px;
  }
  &-subject-subscribe {
    font-size: 14px;
    p {
      line-height: 1;
    }
    .price {
      color: #f2564e;
      font-size: 30px;
      small {
        margin-right: 3px;
        font-size: 14px;
      }
    }
    .text {
      color: #ccc;
    }
  }
  &-subject-subscribe-action {
    width: 256px;
    height: 48px;
    line-height: 48px;
    background-image: linear-gradient(to right, #f2564e, #e6394d);
    text-align: center;
    color: #fff;
    margin-left: 20px;
  }
  &-close {
    position: absolute;
    right: 20px;
    top: 50%;
    margin-top: -8px;
    color: #ccc;
    cursor: pointer;
  }
}
</style>
