<template>
  <section class="original-page">
    <section class="original-meta">
      <ul class="original-meta-top">
        <li class="original-meta-top-item" v-for="msg in yuanchuang.top" :key="msg.Id">
          <ul class="original-meta-top-item-bkj" v-if="msg.BkjInfoArr">
            <li v-for="bkj in msg.BkjInfoArr" :key="bkj.Id">
              <a target="_blank" :href="`/theme/${bkj.Id}`">{{bkj.Name}}</a>
            </li>
          </ul>
          <img :src="msg.Image" v-if="msg.Image">
          <img src="/default-original.png" v-else>
          <div class="original-meta-top-item-modal">
          </div>
          <div class="original-meta-top-item-inner">
            <p class="original-meta-top-item-time">
                <span class="original-own" v-if="hasOwnOriginal(msg.SubjIds)">
                  <i class="iconfont icon-px_qianbi"></i>
                  独家
                </span>
              {{msg.CreatedAt * 1000 | timeago}}
            </p>
            <a class="original-meta-top-item-title" :href="`/article/${msg.Id}`" target="_blank">
              {{msg.Title}}
            </a>
          </div>
        </li>
      </ul>
      <ul class="original-meta-latest" :style="{'background-image': `url(${yuanchuang.top && yuanchuang.top[0].Image})`}">
        <li class="original-meta-latest-item" v-for="msg in yuanchuang.latest" :key="msg.Id">
          <a :href="`/article/${msg.Id}`" target="_blank">
            {{msg.Title | truncate(40, '...')}}
          </a>
          <p class="original-meta-latest-item-time">{{msg.CreatedAt * 1000 | timeago}}</p>
        </li>
      </ul>
    </section>

    <section class="original-content">
      <section class="original-subj">
        <yuanchuang-msgs :msgs="yuanchuang.msgs" />
      </section>
      <section class="original-rank">
        <widget-box title="24小时热文">
          <ul class="original-rank-list">
            <li
              :class="{
                'original-rank-item-main': index <= 2,
                'original-rank-item': true
              }"
              v-for="(msg, index) in yuanchuang.dayRank"
              :key="msg.Id"
            >
              <span class="original-own" v-if="hasOwnOriginal(msg.SubjIds)">
                <i class="iconfont icon-px_qianbi"></i>
                独家
              </span>
              <i :class="['iconfont-index', 'iconfont', `icon-0${index + 1}`]"></i>
              <a :href="`/article/${msg.Id}`" target="_blank">
                {{ msg.Title | truncate(35, '...')}}
              </a>
            </li>
          </ul>
        </widget-box>
        <widget-box title="一周热文">
          <ul class="original-rank-list">
            <li
              :class="{
                'original-rank-item-main': index <= 2,
                'original-rank-item': true
              }"
              v-for="(msg, index) in yuanchuang.weekRank"
              :key="msg.Id"
            >
              <span class="original-own" v-if="hasOwnOriginal(msg.SubjIds)">
                <i class="iconfont icon-px_qianbi"></i>
                独家
              </span>
              <i :class="['iconfont-index', 'iconfont', `icon-0${index + 1}`]"></i>
              <a :href="`/article/${msg.Id}`" target="_blank">
                {{ msg.Title | truncate(35, '...')}}
              </a>
            </li>
          </ul>
        </widget-box>
      </section>
    </section>
  </section>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import YuanchuangMsgs from '~/views/yuanchuang/Msgs'
import texts from '~/utils/texts'

export default {
  async asyncData ({ store }) {
    await Promise.all([
      store.dispatch('yuanchuang/getTop'),
      store.dispatch('yuanchuang/getLatest'),
      store.dispatch('yuanchuang/getdayRank'),
      store.dispatch('yuanchuang/getweekRank'),
      store.dispatch('yuanchuang/getYuanchuangSubj', {
        id: 657,
        params: {
          limit: 20
        }
      })
    ])
  },
  head () {
    return {
      title: `原创频道 | ${texts.slogan}`
    }
  },
  components: {
    WidgetBox,
    YuanchuangMsgs
  },
  computed: {
    yuanchuang () {
      return this.$store.state.yuanchuang
    }
  },
  methods: {
    hasOwnOriginal (ids) {
      return ids && ids.indexOf('396') > -1
    }
  }
}
</script>

<style lang="less" scoped>
.original-meta {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  &-top {
    flex: 3;
    position: relative;
    &-item {
      position: absolute;
      background: #ccc;
      color: #fff;
      // padding: 16px;
      background-position: center;
      background-size: cover;
      background-size: 100%;
      transition: 0.3s;
      overflow: hidden;
      &:hover {
        img {
          transform: scale(1.1)
        }
      }
      &-bkj {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 10;
        li {
          display: inline-block;
          a {
            display: inline-block;
            padding: 3px 7px;
            margin-left: 5px;
            font-size: 12px;
            background: rgba(53,58,71,0.60);
            &:hover {
              background: rgba(53,58,71,1);
            }
          }
        }
      }
      img {
        height: 100%;
        width: 100%;
        transition: .5s;
        transform: scale(1)
      }
      a {
        color: #fff;
      }
      &:first-child {
        top: 0;
        left: 0;
        width: 66.3%;
        height: 320px;
        .original-meta-top-item-title {
          font-size: 24px;
        }
      }
      &:nth-child(2) {
        top: 0;
        left: 66.67%;
        width: 33.33%;
        height: 158px;
      }
      &:nth-child(3) {
        bottom: 0;
        left: 66.67%;
        width: 33.33%;
        height: 158px;
      }
      &-inner {
        position: absolute;
        bottom: 0;
        padding: 16px;
      }
      &-modal {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(-180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.45) 100%);
      }
      &-time {
        font-size: 12px;
      }
    }
  }
  &-latest {
    flex: 0 0 344px;
    font-size: 14px;
    margin-left: 0.3%;
    background-position: center;
    background-size: cover;
    &-item {
      display: flex;
      flex-direction: column;
      position: relative;
      padding: 18px 16px 0 32px;
      height: 80px;
      background: rgba(53, 58, 71, 0.9);
      border-bottom: 1px solid#353A47;
      color: #fff;
      transition: .3s;
      &:hover {
        background: #353A47;
      }
      a {
        color: #fff;
        flex: 1;
      }
      &:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        top: 24px;
        left: 16px;
        background: #E6394D;
      }
      &-time {
        text-align: right;
        font-size: 12px;
        line-height: 12px;
        margin-bottom: 6px;
        color: #bcbcbc;
      }
    }
  }
}

.original-content {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  margin: 32px auto;
}

.original-subj {
  flex-basis: 832px;
}

.original-rank {
  flex-basis: 344px;
  &-list {
    margin-top: 8px;
  }
  &-item {
    position: relative;
    height: 88px;
    padding: 20px 20px 0 16px;
    background: #fff;
    .original-own {
      padding: 0px 4px;
      margin: 0;
      background: #bcbcbc;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #EFEFEF;
    }
    .iconfont-index {
      margin-right: 4px;
      color: #d8d8d8;
    }
    &-main {
      .iconfont-index {
        color: #E52222;
      }
    }
    &:hover {
      background: #fafafa;
    }
    .original-own {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.original-own {
  background: #E6394D;
  color: #fff;
  padding: 2px 3px;
  margin-right: 3px;
  font-size: 12px;
  .iconfont {
    font-size: 12px;
  }
}
</style>
