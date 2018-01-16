<template>
  <section class="article-page">
    <div class="article">
      <div class="article-meta">
        <h1 class="article-meta-title">
          <!-- {{#hasOwnOriginal data.SubjIds}}
            <span class="original-own" style="vertical-align: middle">
              <i class="iconfont icon-px_qianbi"></i>
              独家
            </span>
          {{/hasOwnOriginal}} -->
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
      <article class="article-content">
        <template v-if="data.IsPremium">
          <p>本文为收费内容，请在 <span style="color: #E6394D">微信</span> 中扫描二维码后购买阅读</p>
          <div id="qrcode"></div>
        </template>
        <template v-else>
          <div v-html="data.Content"></div>
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
      
      <stocks-aside-list :stocks="data.Stocks" />
    </aside>
  </section>

</template>

<script>
import { getMessage } from '~/api/message'
import BkjAsideList from '~/components/BkjAsideList'
import StocksAsideList from '~/components/StocksAsideList'

export default {
  async asyncData ({ params }) {
    const data = await getMessage(params.id)
    return { data }
  },
  components: {
    BkjAsideList,
    StocksAsideList
  },
  data () {
    return {}
  },
  head () {
    return {
      title: this.data.Title
    }
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
		color: #A6A2A3;
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

.article-content {
	margin-top: 24px;
	font-size: 16px;
	color: #333333;
	letter-spacing: 0;
	line-height: 30px;
	a {
		color: @mainColorRed;
	}
	a * {
		color: @mainColorRed !important;
	}
	p {
		margin: 20px 0;
	}
	blockquote {
		border-left: 5px solid #eee !important;
		padding-left: 15px;
		margin: 0 15px;
	}
}
.article-aside {
	float: right;
	width: 344px;
}

p.article-content-download {
	margin-top: 50px;
}
</style>

