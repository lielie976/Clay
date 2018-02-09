<template>
  <footer class="premium-article-footer" v-if="show">
    <section class="main-container">
      <div class="left">
        <h2 class="premium-article-footer-subject-title">{{data.FromSubject.Title}}</h2>
        <div class="premium-article-footer-subject-subscribecount">
          <img src="/img/subscribe-icon.png">
          <span>{{getCNPriceNum(data.FromSubject.SubscribeCount, true)}}</span>
          <span>订阅</span>
        </div>
        <div class="premium-article-footer-subject-more">
          <a :href="`/subject/${data.FromSubject.Id}`">了解更多</a><i class="iconfont icon-xiangyou"></i>
        </div>
      </div>
      <div class="right">
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
        <a class="premium-article-footer-subject-subscribe-action" @click="toggleModal">
          我要{{data.FromSubject.RemainingDays > 0 ? '续订' : '订阅'}}
        </a>
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
    data: Object
  },
  data () {
    return {
      //  如果可订阅或者说付费但没有购买才显示
      show: this.data.FromSubject.IsSubscribable || (this.data.IsPremium && !this.data.IsPaid)
    }
  },
  methods: {
    getCNPriceNum,
    toggleModal () {
      this.$store.dispatch('subscribe/toggleModal')
    }
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
    & > div {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .left {
      h2, div {
        flex: 1;
      }
    }
    .right {
      justify-content: flex-end;
    }
  }
  &-subject-title {
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
  }
  &-subject-subscribecount {
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 16px;
      margin: 0 8px;
    }
  }
  &-subject-more {
    flex-basis: 450px;
    font-size: 14px;
    color: #f2564e;
    a {
      color: #f2564e;
    }
    i {
      font-size: 14px;
    }
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
    display: block;
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
