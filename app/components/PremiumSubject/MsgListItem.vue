<template>
  <li
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
        <!-- <div :class="{
          'premium-subject-list-item-meta-categ': true,
          'is-stock': isStock(msg)
        }">
          <p>{{formatDate(msg.CreatedAt * 1000, 'MM月DD日')}}</p>
          <p>{{isStock(msg) || '脱水研报'}}</p>
        </div> -->
        <img :alt="msg.Title" :src="`${ msg.PcImage.trim() || msg.Image.trim() || '/img/tuo-shui-yan-bao-msg.png' }`">
      </div>
      <div class="premium-subject-list-item-content">
        <h3 class="premium-subject-list-item-title">
          <a
            :href="`/article/${msg.Id}`"
            target="_blank"
            ref="title"
          >
            {{msg.Title}}
          </a>
        </h3>
        <div class="premium-subject-list-item-summary">
          <pre ref="pre" class="normal-pre-text">{{msg.Summary}}</pre>
        </div>
        <p>
          <time-widget :time="msg.CreatedAt"  />
        </p>
      </div>
    </div>
  </li>
</template>

<script>
import shave from 'shave'
import { formatDate, getDateDay } from '~/utils/helpers'
import TimeWidget from '~/components/TimeWidget'

export default {
  components: {
    TimeWidget
  },
  props: {
    data: Object,
    msg: Object,
    index: Number
  },
  methods: {
    formatDate,
    getDateDay,
    isStock (msg) {
      return msg.Title.indexOf('脱水个股') > -1 && '脱水个股'
    },
    checkNewest (index) {
      return index === 0 && this.data.params.page === 1
    }
  },
  mounted () {
    shave(this.$refs.title, 54)
    shave(this.$refs.pre, 64)
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

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
      box-shadow: 0 0 8px 0 rgba(29, 33, 38, 0.2);
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
    // &::before {
    //   position: absolute;
    //   content: '';
    //   top: 0;
    //   left: 0;
    //   width: 180px;
    //   height: 180px;
    //   background: rgba( 53, 58, 71, 0.6);
    // }
  }
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 12px 20px;
  }
  &-title {
    font-size: 18px;
    line-height: 27px;
    color: #333;
    margin-bottom: 6px;
    font-weight: bold;
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
