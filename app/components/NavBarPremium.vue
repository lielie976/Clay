<template>
  <div class="nav-item" target="_blank" @mouseover="show = true" @mouseleave="show = false">
    <span>精选<img src="/img/tuoshui-badge.png" class="is-hot" /></span>
    <ul :class="['nav-dropdown', `${show && 'is-active'}`]">
      <li><a href="/tuoshuiyanbao" target="_blank">脱水研报</a></li>
      <li><a href="/tuoshuidiaoyan" target="_blank">脱水调研</a></li>
      <li><a href="/zaozhidao" target="_blank">选股宝早知道</a></li>
      <li><a href="/panzhongtufa" target="_blank">选股宝盘中突发</a></li>
      <li><a href="/zhangjiazaozhidao" target="_blank">选股宝涨价早知道</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  }
}
</script>

<style lang="less" scoped>
.nav-item {
  cursor: pointer;
  margin: 0 0 0 -13px !important;
  padding: 0 40px 0 13px;
  img {
    vertical-align: middle;
    margin-top: -2px;
    margin-left: 2px;
  }
}

.nav-dropdown {
  display: none;
  position: absolute;
  top: 56px;
  left: 0px;
  background-color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.3);
  z-index: 100;
  &.is-active {
    display: block;
  }
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 20px;
    border: 5px solid #fff;
    border-color: transparent;
    border-bottom-color: #fff;
  }
  li {
    width: 160px;
    height: 48px;
    line-height: 48px;
    a {
      display: block;
      padding-left: 16px;
      color: #666;
    }
    &:hover {
      a {
        color: #333;
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
