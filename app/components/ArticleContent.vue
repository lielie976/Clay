<template>
  <div :class="['article-content', `${options.noSelect && 'no-select'}`]" ref="content" v-html="html"></div>
</template>

<script>
import URI from 'urijs'

export default {
  props: {
    html: String,
    options: {
      default: {},
      type: Object
    }
  },
  methods: {
    lightGallery () {
      if (!this.$refs.content) return
      this.$refs.content.querySelectorAll('img').forEach(img => {
        img.setAttribute('data-src', img.getAttribute('src'))
        window.lightGallery(img, {
          selector: 'this'
        })
      })
    },
    handleLinks (selector) {
      if (!selector) return
      const links = selector.querySelectorAll('a')
      for (var i = 0; i < links.length; i++) {
        const currentLink = URI(links[i].href)
        const host = currentLink.host()
        const pathname = currentLink.pathname()
        const segment = currentLink.segment()
        if (pathname && host.indexOf('xuangubao.cn') > -1) {
          links[i].setAttribute('target', '_blank')
          const transformStockField = ['web/stocks', '/stock']
          const transformSubjectField = ['web/subjects', '/subject']
          const transformArticleField = ['web/articles', 'web/messages', 'web/3rdparty', '/article', '/message']
          const transformThemeField = ['/theme/']
          transformStockField.forEach((field) => {
            if (pathname.indexOf(field) > -1) {
              links[i].href = `/stock/${segment[segment.length - 2]}`
            }
          })
          transformSubjectField.forEach((field) => {
            if (pathname.indexOf(field) > -1) {
              links[i].href = `/subject/${segment[segment.length - 1]}`
            }
          })
          transformArticleField.forEach((field) => {
            if (pathname.indexOf(field) > -1) {
              links[i].href = `/article/${segment[segment.length - 1]}`
            }
          })
          transformThemeField.forEach((field) => {
            if (pathname.indexOf(field) > -1) {
              links[i].href = `/theme/${segment[segment.length - 1]}`
            }
          })
        }
      }
    },
    prevent () {
      if (!this.options.noSelect) return
      document.addEventListener('contextmenu', e => e.preventDefault())
      document.addEventListener('selectstart', e => e.preventDefault())
      document.addEventListener('copy', e => e.preventDefault())
      document.addEventListener('keydown', e => {
        if (e.ctrlKey || e.metaKey) e.preventDefault()
      })
    }
  },
  mounted () {
    this.lightGallery()
    this.handleLinks(this.$refs.content)
    this.prevent()
  }
}
</script>

<style lang="less">
@import '../styles/variables.less';

.article-content {
  &.no-select {
    user-select: none;
  }
  a {
    // color: @mainColorRed;
    border-bottom: 1px solid @mainColorRed;
    padding-bottom: 3px;
  }
  a * {
    color: @mainColorRed !important;
  }
  p {
    margin: 20px 0;
  }
  img {
    cursor: zoom-in;
    padding: 20px;
    width: 100%;
  }
  blockquote {
    border-left: 5px solid #eee !important;
    padding-left: 15px;
    margin: 0 15px;
  }
}
</style>