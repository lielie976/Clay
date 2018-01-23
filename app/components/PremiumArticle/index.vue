<template>
  <section class="main-container">
    <section class="main-container-left">
      <article-content :html="data.Content" />
    </section>
    <section class="main-container-right">
      <locked-aside-bkj />
      <locked-aside-stocks />
    </section>
  </section>
</template>

<script>
import LockedAsideStocks from '~/components/LockedAsideStocks'
import LockedAsideBkj from '~/components/LockedAsideBkj'
import ArticleContent from '~/components/ArticleContent'

export default {
  components: {
    LockedAsideStocks,
    LockedAsideBkj,
    ArticleContent
  },
  props: {
    data: Object
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.main-container-left {
  padding: 24px 32px;
  background-color: #fff;
}
</style>
