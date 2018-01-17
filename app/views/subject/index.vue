<template>
  <div>
    <header class="article-list-header">
      <div class="article-list-header-inner">
        <h1 class="article-list-header-title">{{title}}</h1>
      </div>
    </header>

    <section class="article-list-page">
      <section class="article-list-main">
        <widget-box title="最新动态">
        <ul id="article-list" class="article-list">
          <msg-item v-if="msgs" v-for="msg in msgs" :key="msg.Id" :msg="msg" />
          <div class="article-list-not-found" v-else>
            <img src="/img/no_theme_info.png" alt="暂无更多文章">
            <p>暂无更多内容，小编正在努力赶工</p>
          </div>
        </ul>
        </widget-box>
      </section>
      <aside class="article-list-aside">
        <bkj-aside-list :data="bkj" title="相应板块" v-if="bkj" />

        <stocks-aside-list :stocks="stocks" v-if="stocks" />
      </aside>
    </section>
  </div>
</template>

<script>
import WidgetBox from '~/components/WidgetBox'
import StocksAsideList from '~/components/StocksAsideList'
import BkjAsideList from '~/components/BkjAsideList'
import pageScrolledToBottom from '~/mixins/pageScrolledToBottom'
import MsgItem from './MsgItem'

export default {
  components: {
    WidgetBox,
    StocksAsideList,
    BkjAsideList,
    MsgItem
  },
  props: {
    title: {
      type: String
    },
    stocks: {
      type: Array
    },
    msgs: {
      type: Array
    },
    bkj: {
      type: Array
    },
    loadMore: {
      type: Function
    }
  },
  mixins: [pageScrolledToBottom],
  methods: {
    reachedBottom () {
      this.loadMore()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.article-list-page {
  width: 1200px;
	min-height: calc(100vh - 56px);
	margin: 0 auto;
	padding: 40px 0;
	overflow: hidden;
}

.article-list-header {
  height: 120px;
  min-width: 1200px;
  background: #353A47;
  &-inner {
    width: 1200px;
    margin: 0 auto;
    padding: 32px 0 30px;
  }
  &-title {
    display: inline-block;
    font-size: 28px;
    color: #fff;
    border-left: 4px solid @mainColorRed;
    line-height: 28px;
    padding-left: 20px;
    margin-bottom: 16px;
    a {
      color: #fff;
    }
  }
  &-bkj {
    font-size: 12px;
    color: #999;
  }
  &-rate {
    display: inline-block;
    font-size: 36px;
    margin-left: 80px;
    vertical-align: bottom;
  }
  &-info {
    padding-left: 20px;
    font-size: 14px;
    color: #fff;
  }
}

.article-list-main {
  float: left;
	width: 832px;
  padding: 0 32px 0 0;
}

.article-list {
  margin-top: 8px;
  background: #fff;
  min-height: 300px;
}

.article-list-aside {
  float: right;
  width: 344px;
}

.article-list-bk {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  min-height: 64px;
  margin-top: 8px;
  padding: 0 24px;
  color: #fff;
  &:hover {
    color: #fff;
  }
}

.article-list-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  p {
    margin-top: 10px;
    color: #999;
  }
}
</style>

