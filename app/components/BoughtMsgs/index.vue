<template>
  <widget-box title="已购文章">
    <div>
      <ul class="aside-bought-msgs">
        <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="msg" />
      </ul>
      <div class="pagination" v-if="data.total > data.params.limit">
        <Page
          :current="data.params.page"
          :total="100"
          show-elevator
          @on-change="changePage"
        />
      </div>
    </div>
  </widget-box>
</template>

<script>
import { smoothscroll } from '~/utils/helpers'
import WidgetBox from '~/components/WidgetBox'
import MsgItem from './MsgItem'

export default {
  components: {
    WidgetBox,
    MsgItem
  },
  props: {
    msgs: Array,
    data: Object
  },
  methods: {
    changePage (page) {
      smoothscroll()
      this.$store.commit('boughtMsgs/changePage', page)
    }
  }
}
</script>

<style lang="less" scoped>
.aside-bought-msgs {
  background: #fff;
  padding-left: 24px;
}
.pagination {
  padding: 10px 0;
}
</style>

