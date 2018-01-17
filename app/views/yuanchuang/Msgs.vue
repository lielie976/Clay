<template>
  <div>
    <ul class="original-subj-tabs">
      <li 
        :class="['original-subj-tab', `${tab.id === active ? 'active' : ''}`]"
        @click="select(tab.id)"
        v-for="tab in tabs"
        :key="tab.id"
      >
        {{tab.title}}
      </li>
    </ul>
    <ul id="original-subj-list">
      <msg v-for="msg in msgs" :key="msg.Id" :msg="msg" :active="active" />
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import pageScrolledToBottom from '~/mixins/pageScrolledToBottom'
import Msg from './Msg'

export default {
  props: {
    msgs: Array
  },
  components: {
    Msg
  },
  mixins: [pageScrolledToBottom],
  data () {
    return {
      tabs: [
        { id: 657, title: '原创' },
        { id: 1, title: '早晚报' },
        { id: 8, title: '每日复盘' },
        { id: 2, title: '龙虎榜' },
        { id: 5, title: '公告精选' }
      ],
      active: 657,
      loading: false
    }
  },
  methods: {
    ...mapActions({
      getMsgs: 'yuanchuang/getYuanchuangSubj',
      loadMsgs: 'yuanchuang/loadMoreYuanchuangSubj'
    }),
    select (id) {
      this.active = id
      this.getMsgs({
        id,
        params: {
          limit: 20
        }
      })
    },
    reachedBottom () {
      if (this.loading) return
      this.loading = true
      this.loadMsgs({
        id: this.active,
        params: {
          limit: 20,
          Mark: this.msgs[this.msgs.length - 1].Id
        }
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.original-subj {
  &-tabs {
    border-bottom: 1px solid #D8D8D8;
    margin-bottom: 8px;
  }
  &-tab {
    display: inline-block;
    padding-bottom: 5px;
    margin: 0 20px -1px;
    cursor: pointer;
    &.active {
      border-bottom: 2px solid #E52222;
    }
  }
}
</style>
