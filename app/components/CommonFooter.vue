<template>
  <footer class="footer">
    <p>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010102003447" target="_blank" class="beian">
        <img src="/img/beian.png" alt="沪公网安备 31010102003447号" class="gongan">沪公网安备 31010102003447号
      </a>
    </p>
    <p>&copy;  2016 - {{new Date().getFullYear()}} 选股宝-上海阿牛信息科技有限公司 xuangubao.cn
      <a href="http://www.miitbeian.gov.cn" target="_blank" class="beian">沪ICP备13019121号-4</a>
    </p>
    <p>
      联系微信：jiepannvxia666
      <span class="work-time">工作时间：周一至周五 9:30-18:30</span>
      <span class="work-time">中国（上海）自由贸易试验区张杨路707号二层西区</span>
      <span class="work-time">风险提示：市场有风险，投资需谨慎</span>
    </p>
  </footer>
</template>

<style lang="less" scoped>
.footer {
	min-width: 1200px;
	display: flex;
  flex-direction: column;
  justify-content: center;
	height: 60px;
	margin-top: 60px;
	background: #353A47;
	color: #fff;
	font-size: 10px;
	text-align: center;
	.beian {
		color: #fff;
	}
	.gongan {
		width: 14px;
		margin-right: 3px;
	}
	.work-time{
		margin-left: 15px;
	}
}
</style>

