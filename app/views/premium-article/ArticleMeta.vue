<template>
  <div class="article-meta" :style="{'background-image': `url(${data.FromSubject.Image})`}">
    <div class="inner">
      <section class="main-container">
        <section class="main-container-left">
          <p class="article-meta-title">{{data.Title}}</p>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  computed: {
    isStock () {
      return this.data.Title.indexOf('脱水个股') > -1 && '脱水个股'
    }
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
    padding: 20px 0;
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
  &-title {
    font-size: 28px;
    line-height: 1.43;
  }
}
</style>

