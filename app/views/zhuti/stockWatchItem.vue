<template>
  <div class="stock-watch-item">
    <span class="stock-watch-item-name">{{item.name}}</span>
    <span :class="color(item.px)">{{changeRate(item.px)}}</span>
  </div>
</template>

<script>
/* eslint-disable no-debugger */
import shareMethodMixin from '~/mixins/shareMethodMixin'
export default {
  props: ['item'],
  data () {
    return {
    }
  },
  mixins: [shareMethodMixin],
  methods: {
  },
  mounted () {
  }
};
</script>

<style lang="less" scoped>
.stock-watch-item{
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  height: 24px;
  display: inline-block;
  box-shadow: 0 0 4px 0 rgba(53,58,71,0.08);
  padding: 6px;
  border-left:2px solid #ADB4C7;
  font-size:12px;
  line-height: 12px;
  &-name{
    margin-right: 10px;
  }
}
</style>
