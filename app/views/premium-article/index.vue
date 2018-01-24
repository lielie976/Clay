<template>
  <div>
    <article-meta :data="data" />
    <premium-article :data="data" :readable="readable" /> 
    {{readable}}
  </div>
</template>

<script>
import PremiumArticle from '~/components/PremiumArticle'
import ArticleMeta from './ArticleMeta'

export default {
  components: {
    PremiumArticle,
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
