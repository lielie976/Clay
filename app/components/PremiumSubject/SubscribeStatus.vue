<template>
  <div class="subscribe-status">
    <template v-if="1">
      <p class="subscribe-status-price"><small id="rmb">￥</small>432.00 <small>起</small></p>
      <p class="subscribe-status-discount">包年/月/年立省 1843.20</p>
      <a class="subscribe-status-action" href="javascript: void(0)">我要订阅</a>
    </template>
    <template v-else>
      <p class="subscribe-status-remaindate">只剩<span>3</span>天</p>
      <p class="subscribe-status-validdate">有效期：2018/11/22</p>
      <a class="subscribe-status-action" href="javascript: void(0)">我要续订</a>
    </template>
  </div>
</template>

<script>
export default {
  props: {}
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-status {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 70px;
  &-price {
    font-size: 36px;
    line-height: 36px;
    color: #f2564e;
    small {
      font-size: 20px;
      color: #ccc;
      &#rmb {
        color: #f2564e;
      }
    }
  }
  &-discount {
    font-size: 14px;
    margin: 8px 0 24px;
  }
  &-action {
    width: 256px;
    height: 48px;
    line-height: 48px;
    background-image: linear-gradient(to right, #f2564e, #e6394d);
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin-top: 24px;
  }
  &-validdate {
    font-size: 20px;
    color: #999999;
  }
  &-remaindate {
    font-size: 18px;
    color: #f2564e;
    margin-bottom: 18px;
    span {
      display: inline-block;
      margin: 0 8px;
      font-size: 48px;
      line-height: 1;
    }
  }
}
</style>
