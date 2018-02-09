<template>
  <div class="premium-subject-meta">
    <div class="premium-subject-meta-info">
      <meta-info :subject="subject" />
    </div>
    <div class="premium-subject-meta-subscribe">
      <subscribe-status :data="subject" />
    </div>
    <subscribe-form-with-modal />
  </div>
</template>

<script>
import SubscribeFormWithModal from '~/components/SubscribeForm/WithModal'
import MetaInfo from './MetaInfo'
import SubscribeStatus from './SubscribeStatus'

export default {
  props: {
    subject: Object
  },
  components: {
    SubscribeFormWithModal,
    MetaInfo,
    SubscribeStatus
  }
}
</script>

<style lang="less" scoped>
.premium-subject-meta-info {
  position: relative;
  flex: 2;
  background: rgba( 53, 58, 71, 0.8);
  min-height: 296px;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -1000px;
    height: 100%;
    width: 1000px;
    background: rgba( 53, 58, 71, 0.8);
  }
}
.premium-subject-meta {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  color: #fff;
  min-height: 296px;
  &-subscribe {
    position: relative;
    flex: 1;
    background: rgba( 53, 58, 71, 0.95);
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 100%;
      height: 100%;
      width: 1000px;
      background: rgba( 53, 58, 71, 0.95);
    }
  }
}
</style>
