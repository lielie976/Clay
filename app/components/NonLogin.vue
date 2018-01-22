<template>
  <div class="non-login">
    <i class="iconfont icon-weidenglu"></i>
    <p class="non-login-title">登录账号后，可同步查看选股宝APP上购买过的文章和订阅话题</p>
    <button>登录</button>
    <p class="non-login-warning">注：请保证网页端账号与选股宝APP账号保持一致</p>
  </div>
</template>

<style lang="less" scoped>
@import '../styles/variables.less';

.non-login {
  display: flex;
  align-items: items;
  justify-content: center;
  flex-direction: column;
  width: 344px;
  height: 301px;
  background-color: #ffffff;
  padding: 32px 48px;
  .iconfont {
    font-size: 56px;
    text-align: center;
  }
  &-title {
    font-size: 14px;
    line-height: 1.57;
    text-align: center;
    color: @subFontColor;
  }
  button {
    height: 40px;
    line-height: 40px;
    border: solid 1px #353a47;
    outline: none;
    font-size: 14px;
    margin: 16px 0;
    cursor: pointer;
    &:active {
      color: #fff;
      background-color: #666;
    }
  }
  &-warning {
    font-size: 12px;
    line-height: 1.5;
    color: @mainRed;
  }
}
</style>

