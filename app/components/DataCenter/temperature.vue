<template>
  <div>
    <span class="datacenter-temperature-title-label">市场真实热度</span>
    <span 
      v-if="true"
      class="datacenter-temperature-title-ratio -market-color--rise"
    >
      <!-- todo: 颜色 -->
      {{ data.temperature }}%
    </span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        temperature: 0
      }
    }
  }
}
</script>
