<template>
  <th :class="{'sorting':isSorting,'twoline':twoLine}" @click="startSort">
    <span v-html="label"></span>
    <span  class="arrow-container">
      <i :class="{'icon-desc':isdesc,'icon-asc':isasc}" class="iconfont" ></i>
      </span>
  </th>
</template>

<script>
  export default {
    props: ['label', 'sortRule', 'targetProp', 'twoLine'],
    computed: {
      isSorting () {
        return this.sortRule.mode !== 'default' && this.sortRule.targetProp === this.targetProp
      },
      isdesc () {
        return this.sortRule.targetProp === this.targetProp && this.sortRule.mode === 'desc'
      },
      isasc () {
        return this.sortRule.targetProp === this.targetProp && this.sortRule.mode === 'incr'
      }
    },
    methods: {
      startSort () {
        this.$emit('sort', this.targetProp)
      }
    }
  }
</script>

<style lang="less" scoped>
th{
  font-size: 12px;
  color:#666666;
  width:90px;
  height: 32px;
  vertical-align: middle;
  cursor: pointer;
  text-align: center;
  line-height: 32px;
  &.twoline{
    line-height: 16px;
  }
  >span{
    display: inline-block;
    vertical-align: middle;
    height: 32px;
  }
  .arrow-container{
    height: 12px;
    width: 12px;
    position: relative;
    display: inline-block;
    top: 2px;
    left: 3px;
    .iconfont {
      font-size: 12px;
      line-height: 12px;
      &:before{
        content: '\e678';
        display: block;
        font-family:'iconfont';
        height: 12px;
        width: 12px;
        position: absolute;
        top: 0;
        color:#d8d8d8;
      }
      &.icon-asc{
        &:after{
          content: '\e677';
          display: block;
          font-family:'iconfont';
          height: 12px;
          width: 12px;
          position: absolute;
          top: -3px;
          color:#999999;
        }
      }
      &.icon-desc{
        &:after{
          content: '\e676';
          display: block;
          font-family:'iconfont';
          height: 12px;
          position: absolute;
          top: 3px;
          width: 12px;
          color:#999999;
        }
      }
    }
  }
  &.sorting{
    // color:#120f0a;
    background:rgba(230, 57, 77,0.06);
    color:#333;
  }
  &:hover{
    color:#333;
  }
}
</style>
