<template>
  <li :class="['article-list-item', `article-list-item-style-${msg.Style}`]">
    <div class="article-list-item-content">
      <a
        :href="`/article/${msg.Id}`"
        target="_blank"
        class="article-list-item-title"
        v-if="msg.Style !== '1'"
      >
        {{msg.Title}}
      </a>
      <span
        class="article-list-item-title"
        v-else
      >
        {{msg.Title}}
      </span>
      <pre class="article-list-item-summary normal-pre-text">{{msg.Summary}}</pre>
      <div class="article-list-item-time">
        <i class="iconfont icon-shijianicon"></i>
        <time>{{ msg.CreatedAt * 1000 | formatDate('YYYY/MM/DD HH:mm') }}</time>
      </div>
    </div>
    <div class="article-list-item-image" v-if="msg.Image">
      <img :src="msg.Image" :data-src="msg.Image" :alt="msg.Title" ref="image">
    </div>
  </li>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object
    }
  },
  mounted () {
    if (!this.msg.Image) return
    window.lightGallery(this.$refs.image, {
      selector: 'this'
    })
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.article-list-item {
  display: flex;
  padding: 24px 24px 18px 24px;
  &-style-2,
  &-style-3 {
    &:hover {
      background: #fafafa;
      pre {
        background: #fafafa;
      }
      a {
        color: @mainFontColorHover;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  &-title {
    font-size: 16px;
    color: #333333;
    margin-bottom: 10px;
  }
  &-summary {
    flex: 1 0 auto;
    font-size: 14px;
    color: #666666;
  }
  &-time {
    margin-top: 12px;
    line-height: 1;
    .iconfont {
      font-size: 12px;
      margin-right: 4px;
    }
    time {
      font-size: 12px;
      color: #9C9899;
    }
  }
  &-image img {
    width: 96px;
    height: 96px;
    cursor: zoom-in;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
}
</style>
