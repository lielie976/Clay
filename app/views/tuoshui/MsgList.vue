<template>
  <widget-box title="研报更新">
    <ul class="premium-subject-list">
      <li
        v-for="(msg, index) in processedMsgs"
        :key="msg.Id"
        :class="{
          'premium-subject-list-item': true,
          'is-newest': checkNewest(index)
        }"
      >
        <div class="premium-subject-list-item-headertime" v-if="msg.divideDay">
          <span>{{formatDate(msg.CreatedAt * 1000, 'MM月DD日')}}</span>
          <span>{{getDateDay(msg.CreatedAt * 1000, true)}}</span>
        </div>
        <div class="premium-subject-list-item-inner">
          <div class="premium-subject-list-item-meta">
            <div :class="{
              'premium-subject-list-item-meta-categ': true,
              'is-stock': isStock(msg)
            }">
              <p>{{formatDate(msg.CreatedAt * 1000, 'MM月DD日')}}</p>
              <p>{{isStock(msg) || '脱水研报'}}</p>
            </div>
            <img v-if="isStock(msg)" src="/img/tuo-shui-ge-gu-msg.png" :alt="msg.Title">
            <img v-else src="/img/tuo-shui-yan-bao-msg.png" :alt="msg.Title">
          </div>
          <div class="premium-subject-list-item-content">
            <h3 class="premium-subject-list-item-title">
              <a
                :href="`/premium-article/${msg.Id}`"
                target="_blank"
                :class="{
                  'hint--top': msg.Title.length > 64
                }"
                :aria-label="msg.Title"
              >
                {{msg.Title | truncate(64, '...')}}
              </a>
            </h3>
            <div class="premium-subject-list-item-summary">
              <pre class="normal-pre-text">{{msg.Summary}}</pre>
            </div>
            <p>
              <time-widget :time="msg.CreatedAt"  />
            </p>
          </div>
        </div>
      </li>
    </ul>
    <div class="pagination">
      <Page
        :current="data.params.page"
        :total="100"
        show-elevator
        @on-change="changePage"
      />
    </div>
  </widget-box>
</template>

<script>
import { formatDate, getDateDay, smoothscroll } from '~/utils/helpers'
import TimeWidget from '~/components/TimeWidget'
import WidgetBox from '~/components/WidgetBox'

export default {
  props: {
    msgs: Array,
    data: Object
  },
  components: {
    TimeWidget,
    WidgetBox
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
    formatDate,
    getDateDay,
    isStock (msg) {
      return msg.Title.indexOf('脱水个股') > -1 && '脱水个股'
    },
    changePage (page) {
      const top = document.querySelector('.premium-subject-list').offsetTop - 100
      smoothscroll(top)
      this.$store.commit('tuoshui/changePage', page)
    },
    checkNewest (index) {
      return index === 0 && this.data.params.page === 1
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
.premium-subject-list-item {
  position: relative;
  margin: 0 0 24px 0;
  &.is-newest {
    color: red;
    .premium-subject-list-item-headertime {
      color: @mainRed;
      border-left-color: @mainRed;
    }
  }
  &-inner {
    display: flex;
    height: 182px;
    margin: 0 16px 0;
    border: solid 1px #efefef;
    transition: 0.4s;
    margin-top: 15px;
    &:hover {
      box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.1);
    }
  }
  &-headertime {
    color: #999999;
    font-size: 14px;
    line-height: 12px;
    padding-left: 12px;
    border-left: 4px solid #cccccc;
    span {
      margin-right: 10px;
    }
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
      &.is-stock {
        background-image: linear-gradient(-133deg, #5283C5 0%, #D53C51 100%);
      }
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
    pre {
      max-height: 64px;
      overflow: hidden;
    }
  }
}
.pagination {
  padding: 10px 0;
}
</style>
