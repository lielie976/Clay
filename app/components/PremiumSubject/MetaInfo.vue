<template>
  <div class="premium-subject-meta-info">
    <h1 class="premium-subject-meta-info-title">
      {{subject.Title}}
      <i class="iconfont icon-tarengoumai"></i>
      <span class="premium-subject-meta-info-count">{{subject.SubscribeCount}}人订阅</span>
    </h1>
    <section class="premium-subject-meta-info-detail">
      <h3>简介</h3>
      <p>{{subject.Introduction}}</p>
    </section>
    <section class="premium-subject-meta-info-detail"  v-if="showAll">
      <h3>能力圈</h3>
      <div><pre class="normal-pre-text">{{specialty}}</pre></div>
    </section>
    <section class="premium-subject-meta-info-detail"  v-if="showAll">
      <h3>更新频率</h3>
      <p>{{subject.UpdateFrequency}}</p>
    </section>
    <span class="premium-subject-meta-info-toggle" @click="showAll = !showAll">
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
.premium-subject-meta-info {
  position: relative;
  flex: 0 0 976px;
  background: rgba( 53, 58, 71, 0.8);
  padding: 56px 72px 24px 160px;
  @media screen and (max-width: 1440px) {
    flex: 1;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 976px;
    height: 100%;
    width: 1000px;
    background: rgba( 53, 58, 71, 0.8);
  }
  &-title {
    font-size: 36px;
    line-height: 36px;
    margin-bottom: 24px;
    .iconfont {
      font-size: 24px;
      color: #e6394d;
    }
  }
  &-count {
    font-size: 16px;
  }
  &-detail {
    font-size: 14px;
    h3 {
      margin-bottom: 15px;
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
