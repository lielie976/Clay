<template>
  <section class="main-container premium-article">
    <section class="main-container-left">
      <article-content ref="content" :html="data.Content" v-if="readable" />
      <template v-else>
        <article-content :html="data.PreviewContent" v-if="data.PreviewContent" />
        <pre v-else-if="data.Summary" class="normal-pre-text">{{data.Summary}}</pre>
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
import axios from 'axios'

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
    },
    generateCypher () {
      if (!this.$refs.content) return
      const userId = JSON.parse(localStorage.getItem('_xgb_userinfo') || '{}').Id
      if (!userId) return
      axios.get(`https://api-prod.wallstreetcn.com/apiv1/anti_fake/image/gen?app_type=xgb&&backgroud_color_rgba=230,57,77,255&front_color_rgba=242,86,78,255&dx=8&dy=16&cipher=${userId}`)
        .then((res) => {
          const hash = res.data.data.cipher_hash
          Array.prototype.slice.call(this.$refs.content.$refs.content.querySelectorAll('h2')).forEach((ele) => {
            ele.style.background = `url('${hash}') no-repeat left 3px`
            ele.style.backgroundSize = '8px 23px'
          })
        })
    },
    prevent () {
      if (process.env.NODE_ENV === 'development') return
      document.addEventListener('contextmenu', e => e.preventDefault())
      document.addEventListener('selectstart', e => e.preventDefault())
      document.addEventListener('copy', e => e.preventDefault())
      document.addEventListener('keydown', e => {
        if (e.ctrlKey || e.metaKey) e.preventDefault()
      })
    }
  },
  mounted () {
    this.prevent()
    this.generateCypher()
    if (!this.$store.state.subscribe.balance) {
      this.$store.dispatch('subscribe/getBalance')
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
    height: 40px;
    display: block;
    margin: 0 auto 12px;
  }
}
</style>

<style lang="less">
.premium-article .article-content {
  h2 {
    padding-left: 15px;
    font-weight: bold;
    font-size: 20px;
  }
}
</style>
