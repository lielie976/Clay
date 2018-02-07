<template>
  <div>
    <ul class="premium-subject-list">
      <msg-item
        v-for="(msg, index) in processedMsgs"
        :key="msg.Id"
        :data="data"
        :msg="msg"
        :index="index"
      />
    </ul>
    <div class="pagination">
      <Page
        :current="data.params.page"
        :total="data.totalMsg"
        show-elevator
        @on-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { smoothscroll } from '~/utils/helpers'
import MsgItem from './MsgListItem'

export default {
  props: {
    msgs: Array,
    data: Object
  },
  components: {
    MsgItem
  },
  computed: {
    processedMsgs () {
      const tmp = {}
      const msgs = this.msgs.map((i) => {
        const date = new Date(i.CreatedAt * 1000).getDate()
        const msg = tmp[date] ? i : {
          ...i,
          divideDay: true
        }
        tmp[date] = true
        return msg
      })
      return msgs
    }
  },
  methods: {
    changePage (page) {
      const top = document.querySelector('.premium-subject-list').offsetTop - 100
      smoothscroll(top)
      this.$store.dispatch('premium/changePage', page)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.premium-subject-list {
  padding: 16px 0 24px;
  background-color: #fff;
}

.pagination {
  padding: 10px 0;
}
</style>
