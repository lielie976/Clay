<template>
  <div>
    <div class="subscribe-form-privilege">
      <ul>
        <li>订阅特权</li>
        <li>
          <i class="iconfont icon-dingyuetequandingyuefuwu"></i>
          <span>订阅服务期内该主题全部文章免费看</span>
        </li>
        <li>
          <i class="iconfont icon-dingyuetequantongbuchakan"></i>
          <span>APP和PC可同步查看已购买内容</span>
        </li>
      </ul>
    </div>
    <p class="subscribe-form-agreement">购买即表示同意 <a target="_blank" href="/agreement">《选股宝主题订阅协议》</a></p>
  </div>
</template>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form-privilege {
  margin-top: 24px;
  font-size: 13px;
  &-header {
    color: @subFontColor;
  }
  ul {
    display: inline-block;
  }
  li {
    display: inline-block;
    margin-right: 20px;
    color: #666;
    font-size: 12px;
    i {
      display: inline-block;
      font-size: 13px;
      color: #ccc;
    }
    span {
      display: inline-block;
      color: #999;
      font-size: 12px;
      margin-left: 8px;
    }
  }
}

.subscribe-form-agreement {
  margin-top: 16px;
  font-size: 13px;
  color: #999;
  span {
    color: @mainFontColor;
  }
}
</style>
