<template>
  <div class="premium-subject-list-container">
    <ul class="premium-subject-list">
      <li
        v-for="msg in msgs"
        :key="msg.Id"
        class="premium-subject-list-item"
      >
        <div class="premium-subject-list-item-headertime">
          <span>{{formatDate(msg.CreatedAtInSec * 1000, 'MM月DD日')}}</span>
          <span>{{getDateDay(msg.CreatedAtInSec * 1000, true)}}</span>
        </div>
        <div class="premium-subject-list-item-inner">
          <div class="premium-subject-list-item-meta">
            <div class="premium-subject-list-item-meta-categ">
              <p>{{formatDate(msg.CreatedAtInSec * 1000, 'MM月DD日')}}</p>
              <p>脱水研报</p>
            </div>
            <img src="/img/tuo-shui-ge-gu-msg.png" :alt="msg.Title">
          </div>
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
        </div>
      </li>
    </ul>
    <div class="pagination">
      <Page :total="100" show-elevator @on-change="onChangePagi"></Page>
    </div>
  </div>
</template>

<script>
import { formatDate, getDateDay } from '~/utils/helpers'
import TimeWidget from '~/components/TimeWidget'

export default {
  props: {
    msgs: Array
  },
  components: {
    TimeWidget
  },
  methods: {
    formatDate,
    getDateDay,
    onChangePagi (page) {
      console.log(page)
    }
  }
}
</script>

<style lang="less" scoped>
.premium-subject-list {
  padding: 16px 0 24px;
  background-color: #fff;
}
.premium-subject-list-item {
  position: relative;
  margin: 0 0 24px 0;
  // display: flex;
  // height: 182px;
  // margin: 0 16px 24px;
  // border: solid 1px #efefef;
  // transition: 0.4s;
  // margin-top: 45px;
  &-inner {
    display: flex;
    height: 182px;
    margin: 0 16px 0;
    border: solid 1px #efefef;
    transition: 0.4s;
    margin-top: 15px;
  }
  &-headertime {
    // content: attr(data-time);
    // position: absolute;
    // top: -30px;
    // left: -17px;
    color: #999999;
    font-size: 14px;
    line-height: 12px;
    padding-left: 12px;
    border-left: 4px solid #cccccc;
    span {
      margin-right: 10px;
    }
  }
  &:hover {
    box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.1);
  }
  &-meta {
    position: relative;
    flex: 0 0 182px;
    width: 182px;
    height: 182px;
    &-categ {
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -32px;
      padding: 10px 0;
      width: 88px;
      height: 64px;
      background-image: linear-gradient(to right, #f2564e, #e6394d);
      color: #fff;
      text-align: center;
      line-height: 22px;
    }
    img {
      width: 180px;
      height: 180px;
    }
    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 180px;
      height: 180px;
      background: rgba( 53, 58, 71, 0.6);
    }
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
