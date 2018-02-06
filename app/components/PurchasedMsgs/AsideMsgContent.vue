<template>
  <div>
    <template v-if="!hasLoggined">
      <non-login />
    </template>
    <template v-else>
      <ul class="aside-purchased-msgs"  v-if="msgs && msgs.length">
        <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="msg" />
      </ul>
      <div v-else>
        暂无已购精选
      </div>
    </template>
  </div>
</template>

<script>
import NonLogin from '~/components/NonLogin'
import MsgItem from './AsideMsgItem'

export default {
  components: {
    NonLogin,
    MsgItem
  },
  props: {
    msgs: Array,
    hasLoggined: Boolean
  }
}
</script>

<style lang="less" scoped>
.aside-purchased-msgs {
  background: #fff;
  padding-left: 16px;
}
</style>

