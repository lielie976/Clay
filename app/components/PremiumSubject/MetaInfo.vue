<template>
  <div class="subscribe-info">
    <h1 class="subscribe-info-title">
      {{subject.Title}}
      <img src="/img/subscribe-icon.png">
      <span class="subscribe-info-count">{{subject.SubscribeCount}}人订阅</span>
    </h1>
    <section class="subscribe-info-detail">
      <h3>简介</h3>
      <p>{{subject.Introduction}}</p>
    </section>
    <section class="subscribe-info-detail"  v-if="showAll">
      <h3>能力圈</h3>
      <div><pre class="normal-pre-text">{{specialty}}</pre></div>
    </section>
    <section class="subscribe-info-detail"  v-if="showAll">
      <h3>更新频率</h3>
      <p>{{subject.UpdateFrequency}}</p>
    </section>
    <span class="subscribe-info-toggle" @click="showAll = !showAll">
      <template v-if="!showAll">
        展开<i class="iconfont icon-xiangxia"></i>
      </template>
      <template v-else>
        收起<i class="iconfont icon-xiangshang"></i>
      </template>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    subject: Object
  },
  computed: {
    specialty () {
      return this.subject.Specialty ? this.subject.Specialty.replace(/\n/g, '\n\n') : this.subject.Specialty
    }
  },
  data () {
    return {
      showAll: false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-info {
  position: relative;
  height: 100%;
  padding: 56px 72px 24px 0;
  &-title {
    font-size: 36px;
    line-height: 36px;
    margin-bottom: 24px;
    img {
      margin-right: 6px;
    }
  }
  &-count {
    font-size: 16px;
    vertical-align: middle;
  }
  &-detail {
    font-size: 14px;
    h3 {
      display: inline-block;
      margin-bottom: 15px;
      border-bottom: 4px solid @strongFontColor;
    }
    p {
      line-height: 22px;
      margin-bottom: 24px;
      color: #ccc;
    }
    pre {
      background-color: transparent;
      color: #ccc;
      margin-bottom: 24px;
    }
  }
  &-toggle {
    color: #F2564E;
    cursor: pointer;
    .iconfont {
      margin-left: 5px;
    }
  }
}
</style>
