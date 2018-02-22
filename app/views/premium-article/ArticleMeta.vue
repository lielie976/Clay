<template>
  <div class="article-meta" :style="{'background-image': `url(${data.FromSubject.PcImage})`}">
    <div class="inner">
      <section class="main-container">
        <section class="main-container-left">
          <p class="article-meta-time">{{time}}</p>
          <p class="article-meta-title" ref="title">{{data.Title}}</p>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import shave from 'shave'
import { formatDate } from '~/utils/helpers'

export default {
  props: {
    data: Object
  },
  computed: {
    isStock () {
      return this.data.Title.indexOf('脱水个股') > -1 && '脱水个股'
    },
    time () {
      const time = formatDate(this.data.CreatedAt * 1000, 'MM月DD日')
      const subjTitle = this.data.FromSubject.Title
      return `${time} ${subjTitle}`
    }
  },
  mounted () {
    shave(this.$refs.title, 80)
  }
}
</script>

<style lang="less" scoped>
.article-meta {
  position: relative;
  height: 120px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  color: #fff;
  .inner {
    padding: 8px 0;
    background: rgba( 53, 58, 71, 0.8);
    height: 100%;
  }
  &-flag {
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -32px;
    padding: 10px 0;
    width: 88px;
    height: 64px;
    background-image: linear-gradient(to right, #f2564e, #e6394d);
    color: #fff;
    text-align: center;
    line-height: 22px;
    &.is-stock {
      background-image: linear-gradient(-133deg, #5283C5 0%, #D53C51 100%);
    }
  }
  &-time {
    display: inline-block;
    background: #E6394D;
    height: 24px;
    line-height: 24px;
    padding: 0 9px;
    font-size: 14px;
  }
  &-title {
    font-size: 28px;
    font-weight: bold;
    line-height: 40px;
    max-height: 80px;
    overflow: hidden;
  }
}
</style>

