<template>
  <widget-box title="已购文章" href="/purchased-message" subTitle="查看全部">
    <div>
      <template v-if="!hasLoggined">
        <non-login />
      </template>
      <template v-else>
        <ul class="aside-purchased-msgs"  v-if="msgs && msgs.length">
          <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="msg" />
        </ul>
        <div v-else>
          暂无已购文章
        </div>
      </template>
    </div>
  </widget-box>
</template>

<script>
import NonLogin from '~/components/NonLogin'
import WidgetBox from '~/components/WidgetBox'
import MsgItem from './AsideMsgItem'

export default {
  components: {
    NonLogin,
    WidgetBox,
    MsgItem
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

