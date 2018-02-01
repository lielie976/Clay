<template>
  <section class="main-container">
    <section class="main-container-left">
      <article-content :html="data.Content" v-if="readable" />
      <template v-else>
        <article-content :html="data.PreviewContent" />
        <div class="unlock-msg">
          <span @click="unlock">
            <img src="/img/unlock.png" alt="解锁全文">
            解锁全文
          </span>
        </div>
      </template>
    </section>
    <section class="main-container-right">
      <template v-if="!readable">
        <locked-aside-bkj />
        <locked-aside-stocks />
      </template>
      <template v-else>
        <bkj-aside-list :data="data.BkjInfos" v-if="data.BkjInfos" />
        <stocks-aside-list :stocks="data.Stocks" v-if="data.Stocks" />
      </template>
    </section>
    <subscribe-form-with-modal />
  </section>
</template>

<script>
import SubscribeFormWithModal from '~/components/SubscribeForm/WithModal'
import LockedAsideStocks from '~/components/LockedAsideStocks'
import LockedAsideBkj from '~/components/LockedAsideBkj'
import ArticleContent from '~/components/ArticleContent'
import BkjAsideList from '~/components/BkjAsideList'
import StocksAsideList from '~/components/StocksAsideList'

export default {
  components: {
    SubscribeFormWithModal,
    LockedAsideStocks,
    LockedAsideBkj,
    ArticleContent,
    BkjAsideList,
    StocksAsideList
  },
  props: {
    data: Object,
    readable: Boolean
  },
  methods: {
    unlock () {
      this.$store.dispatch('subscribe/toggleModal')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.main-container-left {
  padding: 24px 32px;
  background-color: #fff;
}

.main-container-right {
  margin-top: 16px;
}

.unlock-msg {
  text-align: center;  
  color: #e6394d;
  font-size: 14px;
  margin: 64px 0;
  span {
    display: inline-block;
    cursor: pointer;
  }
  img {
    width: 40px;
    height: 48px;
    display: block;
    margin: 0 auto 12px;
  }
}
</style>
