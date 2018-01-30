<template>
  <widget-box title="已购文章" href="/bought" subTitle="查看全部">
    <div v-if="msgs && msgs.length">
      <template v-if="0">
        <non-login />
      </template>
      <template v-else>
        <ul class="aside-bought-msgs">
          <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="processMsg(msg)" />
        </ul>
      </template>
    </div>
    <div v-else>
      暂无已购文章
    </div>
  </widget-box>
</template>

<script>
import { truncate } from '~/utils/helpers'
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
  methods: {
    processMsg (msg) {
      return {
        ...msg,
        Title: truncate(msg.Title, 35, '...')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.aside-bought-msgs {
  background: #fff;
  padding-left: 16px;
}
</style>

