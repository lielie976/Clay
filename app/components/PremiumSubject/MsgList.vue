<template>
  <div class="premium-subject-list-container">
    <ul class="premium-subject-list">
      <li
        v-for="msg in msgs"
        :key="msg.Id"
        class="premium-subject-list-item"
      >
        <img :src="msg.Image" :alt="msg.Title" class="premium-subject-list-item-image">
        <div class="premium-subject-list-item-content">
          <h3 class="premium-subject-list-item-title">
            <a :href="`/article/${msg.Id}`" target="_blank">{{msg.Title}}</a>
          </h3>
          <div class="premium-subject-list-item-summary">
            <pre class="normal-pre-text">{{msg.Summary}}</pre>
          </div>
          <p>
            <time-widget :time="msg.CreatedAtInSec"  />
          </p>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <Page :total="100" show-elevator @on-change="onChangePagi"></Page>
    </div>
  </div>
</template>

<script>
import TimeWidget from '~/components/TimeWidget'

export default {
  props: {
    msgs: Array
  },
  components: {
    TimeWidget
  },
  methods: {
    onChangePagi (page) {
      console.log(page)
    }
  }
}
</script>

<style lang="less" scoped>
.premium-subject-list {
  padding: 16px 0 1px;
  background-color: #fff;
}
.premium-subject-list-item {
  display: flex;
  height: 182px;
  margin: 0 16px 24px;
  border: solid 1px #efefef;
  transition: 0.4s;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.1);
  }
  &-image {
    flex: 0 0 182px;
    width: 182px;
    height: 182px;
  }
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 12px 20px;
  }
  &-title {
    font-size: 18px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 6px;
  }
  &-summary {
    flex: 1;
    font-size: 14px;
    line-height: 1.57;
    color: #666;
  }
}
.pagination {
  padding: 10px 0;
}
</style>
