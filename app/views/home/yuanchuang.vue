<template>
  <widget-box href="/yuanchuang" title="原创热文">
    <article class="home-original-article">
      <h3 class="home-original-article-title">
        <a :href="`/article/${top.Id}`" target="_blank">{{ top.Title }}</a>
      </h3>
      <time class="home-original-article-time">
        <i class="iconfont icon-shijianicon"></i>
        {{ top.CreatedAt * 1000 | formatDate('YYYY/MM/DD HH:mm') }}
      </time>
      <stocks :stocks="top.Stocks" />
    </article>
  </widget-box>
</template>

<script>
import { mapGetters } from 'vuex'
import WidgetBox from '~/components/WidgetBox'
import stocks from '~/components/stocks'

export default {
  components: {
    WidgetBox,
    stocks
  },
  computed: mapGetters({
    top: 'yuanchuang/firstYuanchuangTop'
  })
}
</script>

<style lang="less" scoped>
.home-original-article {
  margin-top: 8px;
  padding: 16px 24px;
  background: #fff;
  border: 1px solid #eee;
  &-title {
    font-size: 16px;
    color: #333333;
    line-height: 24px;
    a {
      display: block;
    }
  }
  &-time {
    display: block;
    font-size: 12px;
    color: #999999;
    line-height: 12px;
    margin: 6px 0;
    .iconfont {
      font-size: 12px;
    }
  }
}
</style>
