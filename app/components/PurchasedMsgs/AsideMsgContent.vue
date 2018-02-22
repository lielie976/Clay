<template>
  <div>
    <template v-if="!hasLoggined">
      <non-login />
    </template>
    <template v-else>
      <ul class="aside-purchased-msgs"  v-if="msgs && msgs.length">
        <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="msg" />
      </ul>
      <div class="aside-purchased-msgs-none" v-else>
        <img src="/img/no-purchased-msg.png" alt="">
        <p>啊哦～您还未在精选栏目留下足迹，这里的内容更值得看哦~</p>
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
.aside-purchased-msgs-none {
  background: #fff;
  padding: 16px;
  img {
    display: block;
    width: 72px;
    height: 72px;
    margin: 0 auto 16px;
  }
  p {
    text-align: center;
    font-size: 14px;
    color: #999;
  }
}
</style>

