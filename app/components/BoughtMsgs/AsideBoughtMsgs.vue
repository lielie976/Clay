<template>
  <widget-box title="已购文章" href="/bought" subTitle="查看全部">
    <div>
      <template v-if="0">
        <non-login />
      </template>
      <template v-else>
        <ul class="aside-bought-msgs">
          <msg-item  v-for="msg in msgs" :key="msg.id" :msg="processMsg(msg)" />
        </ul>
      </template>
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
        title: truncate(msg.title, 35, '...')
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

