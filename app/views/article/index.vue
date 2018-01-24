<template>
  <section class="article-page">
    <div class="article">
      <div class="article-meta">
        <h1 class="article-meta-title">
          <span class="original-own" style="vertical-align: middle" v-if="hasOwnOriginal(data.SubjIds)">
            <i class="iconfont icon-px_qianbi"></i>
            独家
          </span>
          <span style="vertical-align: middle">{{ data.Title }}</span>
        </h1>
        <div class="article-meta-time">
          <span>{{ data.CreatedAt * 1000 | formatDate('YYYY/MM/DD HH:mm') }}</span>
          <span v-if="data.DisplayAuthor" class="article-meta-author">文/{{data.DisplayAuthor}}</span>
        </div>
      </div>

      <article class="explained-article" v-for="msg in data.ExplainedInfos" :key="msg.ExplainedMsgId" v-if="data.ExplainedInfos">
        <time class="explained-article-time">{{ msg.ExplainedMsgTime | formatDate('MM月DD日 HH:mm')}}</time>
        <a class="explained-article-title" :href="`/article/${msg.ExplainedMsgId}`" target="_blank">{{msg.ExplainedMsgTitle}}</a>
        <pre v-if="msg.ExplainedMsgSummary" class="explained-article-summary normal-pre-text">{{msg.ExplainedMsgSummary}}</pre>
      </article>
      
      <pre v-if="data.Summary && !data.ExplainedInfos" class="article-summary normal-pre-text">{{data.Summary}}</pre>
      <article>
        <template v-if="data.IsPremium">
          <p>本文为收费内容，请在 <span style="color: #E6394D">微信</span> 中扫描二维码后购买阅读</p>
          <div ref="qrcode"></div>
        </template>
        <template v-else>
          <article-content :html="data.Content" />
        </template>

        <p v-if="data.OriginalUrl">本文来源{{data.Source}}，<a class="not-article-content" :href="data.OriginalUrl">查看原文</a></p>

        <p class="article-content-download">
          ( 更多精彩A股内容，
          <a class="not-article-content" href="http://bao.wallstreetcn.com/static/app.html?from=PC_ARTICLE">点击这里下载选股宝App</a> )
        </p>
      </article>
    </div>
    <aside class="article-aside">
      <bkj-aside-list :data="data.BkjInfos" v-if="data.BkjInfos" />
      
      <stocks-aside-list :stocks="data.Stocks" v-if="data.Stocks" />
    </aside>
  </section>

</template>

<script>
import BkjAsideList from '~/components/BkjAsideList'
import StocksAsideList from '~/components/StocksAsideList'
import ArticleContent from '~/components/ArticleContent'
import config from '~/conf'

export default {
  components: {
    BkjAsideList,
    StocksAsideList,
    ArticleContent
  },
  props: {
    data: Object
  },
  methods: {
    generateQrcode () {
      if (!this.$refs.qrcode) return
      const qrcode = new window.QRCode(this.$refs.qrcode)
      qrcode.makeCode(`${config.M_DOMAIN}/message/${this.data.Id}`)
    },
    hasOwnOriginal (ids) {
      return ids && ids.indexOf('396') > -1
    }
  },
  mounted () {
    this.generateQrcode()
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.article-page {
  width: 1200px;
  min-height: calc(100vh - 56px);
  margin: 0 auto;
  padding: 40px 0;
  overflow: hidden;
}
.article {
  float: left;
  width: 832px;
  padding: 32px;
  background: #fff;
}
.article-meta {
  border-bottom: 1px solid #efefef;
  padding-bottom: 16px;
  &-time {
    font-size: 12px;
    color: #a6a2a3;
    margin-top: 12px;
  }
  &-author {
    margin-left: 32px;
  }
  &-title {
    position: relative;
    font-size: 28px;
    color: #333333;
    letter-spacing: 0;
    line-height: 1.35;
    &:before {
      position: absolute;
      top: 10px;
      left: -32px;
      content: '';
      width: 4px;
      height: 24px;
      background: @mainColorRed;
    }
  }
}

.article-summary {
  background-color: #fafafa;
  color: @subFontColor;
  margin-top: 24px;
  padding: 15px;
  font-size: 16px;
  line-height: 1.8;
}

.article-aside {
  float: right;
  width: 344px;
}

p.article-content-download {
  margin-top: 50px;
}
</style>
