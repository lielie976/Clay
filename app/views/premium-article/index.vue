<template>
  <div>
    <article-meta :data="data" />
    <premium-article :data="data" :readable="readable" /> 
    <premium-article-footer :data="data" />
  </div>
</template>

<script>
import PremiumArticle from '~/components/PremiumArticle'
import PremiumArticleFooter from '~/components/PremiumArticle/Footer'
import ArticleMeta from './ArticleMeta'

export default {
  components: {
    PremiumArticle,
    PremiumArticleFooter,
    ArticleMeta
  },
  props: {
    data: Object
  },
  computed: {
    readable () {
      return this.data.FromSubject.RemainingDays > 0 || this.data.IsPaid || this.data.IsTrial || !this.data.IsPremium
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';
</style>
