<template>
  <div class="premium-subject-meta-container">
    <div class="premium-subject-meta">
      <meta-info :subject="subject" />
      <div class="premium-subject-meta-subscribe">
        subscribe
      </div>
    </div>
  </div>
</template>

<script>
import MetaInfo from './MetaInfo'

export default {
  props: {
    subject: Object
  },
  components: {
    MetaInfo
  }
}
</script>

<style lang="less" scoped>
.premium-subject-meta-container {
  background: url('/img/tuoshui-banner.jpg') no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}

.premium-subject-meta {
  display: flex;
  width: 1440px;
  margin: 0 auto;
  color: #fff;
  
  &-subscribe {
    position: relative;
    flex: 0 0 464px;
    background: rgba( 53, 58, 71, 0.8);
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 464px;
      height: 100%;
      width: 1000px;
      background: rgba( 53, 58, 71, 0.8);
    }
  }
}
</style>
