<template>
  <div class="home-news-fast-subject">
    <span class="home-news-fast-subject-header">热门话题：</span>
    <ul class="home-news-fast-subject-list" v-if="hotSubjects.length">
      <li class="home-news-fast-subject-listitem" v-for="item in hotSubjects" :key="item.Id">
        <input
          type="checkbox"
          name="fast-subj-checkbox"
          :id="`fast-subj-filter-${item.Id}`"
          :checked="isActive(item.Id)"
          @change="e => setActiveHotSubject({ value: e.target.checked, id: item.Id })"
        />
          <label :for="`fast-subj-filter-${item.Id}`">{{ item.Title }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  computed: {
    hotSubjects () {
      return this.$store.state.homeMsgs.hotSubjects
    }
  },
  methods: {
    ...mapActions({
      setActiveHotSubject: 'homeMsgs/setActiveHotSubject'
    }),
    isActive (id) {
      return id === this.$store.state.homeMsgs.activeHotSubjects
    }
  }
}
</script>

<style lang="less" scoped>
.home-news-fast-subject {
    display: flex;
    padding: 26px 24px 0;
    background: #fff;
    &-header {
      display: inline-block;
      min-width: 64px;
      line-height: 26px;
      vertical-align: middle;
      font-size: 12px;
      color: #999999;
    }
    &-list {
      display: inline-block;
      vertical-align: middle;
    }
    &-listitem {
      display: inline-block;
      margin-bottom: 10px;
      input[type="checkbox"] {
        display: none;
        &:checked ~ label {
          background: #e6394d;
          color: #fff;
        }
      }
      label {
        display: block;
        background: #efefef;
        padding: 5px 8px;
        margin-right: 8px;
        font-size: 14px;
        color: #666666;
        line-height: 14px;
        cursor: pointer;
      }
    }
  }
</style>

