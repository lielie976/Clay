<template>
  <widget-box title="已购精选" href="/purchased-message" subTitle="查看全部" v-if="hasLoggined">
    <aside-msg-content :hasLoggined="hasLoggined" :msgs="msgs" />
  </widget-box>
  <widget-box title="已购精选" v-else>
    <aside-msg-content :hasLoggined="hasLoggined" :msgs="msgs" />
  </widget-box>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import AsideMsgContent from './AsideMsgContent'

export default {
  components: {
    WidgetBox,
    AsideMsgContent
  },
  props: {
    msgs: Array
  },
  computed: {
    hasLoggined () {
      return this.$store.state.user.userInfo.isLogged
    }
  }
}
</script>

<style lang="less" scoped>
.aside-purchased-msgs {
  background: #fff;
  padding-left: 16px;
}
</style>

