<template>
  <div>
    <article-meta :data="data" />
    <premium-article :data="data" /> 
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
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';
</style>
