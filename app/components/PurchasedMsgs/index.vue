<template>
  <widget-box title="已购精选">
    <div>
      <ul class="aside-purchased-msgs">
        <msg-item  v-for="msg in msgs" :key="msg.Id" :msg="msg" />
        <div class="no-purchased-msgs" v-if="!msgs || !msgs.length">
          <img src="/img/no-purchased-msg.png" alt="">
          <p>啊哦～您还未在精选栏目留下足迹，这里的内容更值得看哦~</p>
        </div>
      </ul>
      <div class="pagination" v-if="data.total > data.params.limit">
        <Page
          :current="data.params.page"
          :total="data.total"
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
      this.$store.dispatch('purchasedMsgs/changePage', page)
    }
  }
}
</script>

<style lang="less" scoped>
.aside-purchased-msgs {
  background: #fff;
  padding-left: 24px;
}
.pagination {
  padding: 10px 0;
}
.no-purchased-msgs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 470px;
  p {
    margin-top: 24px;
  }
}
</style>

