<template>
  <div class="datacenter-detail">
    <div class="datacenter-detail-borad">
      <span class="datacenter-detail-label">涨停家数</span>
      <span class="-market-color--red datacenter-detail-count">{{ data.boardStockCount }}</span>
    </div>
    <div class="datacenter-detail-boom">
      <span class="datacenter-detail-label">炸板家数</span>
      <span class="-market-color--green datacenter-detail-count">{{ data.boomStockCount }}</span>
    </div>
    <div class="datacenter-detail-boomratio">
      <span class="datacenter-detail-label">炸板率</span>
      <span class="-market-color--balance datacenter-detail-count">{{ data.boomRatio | toFixed(2) }}%</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  }
}
</script>
