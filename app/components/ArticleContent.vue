<template>
  <div class="article-content" ref="content" v-html="html"></div>
</template>

<script>
import URI from 'urijs'

export default {
  props: {
    html: String
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
        const pathname = URI(links[i].href).pathname()
        const segment = URI(links[i].href).segment()
        if (pathname) {
          links[i].setAttribute('target', '_blank')
          if (pathname.indexOf('web/stocks') > -1) {
            links[i].href = `/stock/${segment[2]}`
          } else if (pathname.indexOf('web/subjects') > -1) {
            links[i].href = `/subject/${segment[2]}`
          } else if (
            pathname.indexOf('web/articles') > -1 ||
            pathname.indexOf('web/messages') > -1 ||
            pathname.indexOf('web/3rdparty') > -1
          ) {
            links[i].href = `/article/${segment[segment.length - 1]}`
          }
        }
      }
    }
  },
  mounted () {
    this.lightGallery()
    this.handleLinks(this.$refs.content)
  }
}
</script>

<style lang="less">
@import '../styles/variables.less';

.article-content {
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
  }
  blockquote {
    border-left: 5px solid #eee !important;
    padding-left: 15px;
    margin: 0 15px;
  }
}
</style>