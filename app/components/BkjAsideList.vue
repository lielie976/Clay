<template>
  <widget-box title="相关板块">
    <a 
      :href="`/theme/${bkj.Id}`"
      :class="{
        'bkj-aside-list': true,
        [renderStatus(bkj.Id).color]: true,
        '-market-bg--balance': !renderStatus(bkj.Id).color
      }"
      target="_blank"
      v-for="bkj in data"
      :key="bkj.Id"
    >
      <span class="bkj-aside-list-name">{{ bkj.Name }}</span>
      <span style="font-size: 24px" class="bkj-aside-list-rate">{{ renderStatus(bkj.Id).pcp }}</span>
    </a>
  </widget-box>
</template>

<script>
import WidgetBox from './WidgetBox'
import { getPlateInfos } from '~/api/wows'
import { extractWowsApiTypeThree } from '~/utils/helpers'

export default {
  props: {
    data: {
      type: Array
    }
  },
  data () {
    return {
      val: {}
    }
  },
  components: {
    WidgetBox
  },
  mounted () {
    getPlateInfos({
      ids: this.data.map(i => i.Id).join(','),
      fields: 'plate_id,plate_name,core_pcp,normal_pcp'
    }).then((res) => {
      this.val = extractWowsApiTypeThree(res.data)
    })
  },
  methods: {
    renderStatus (id) {
      if (!this.val[id]) return {}
      const currentItem = this.val[id]
      const corePcp = currentItem ? currentItem.core_pcp.toFixed(2) : 0
      const pcp = corePcp > 0 ? `+${corePcp}%` : `${corePcp}%`
      let color
      if (corePcp >= 0) {
        color = '-market-bg--rise'
      } else if (corePcp < 0) {
        color = '-market-bg--decline'
      }
      return {
        pcp,
        color
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bkj-aside-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  min-height: 64px;
  margin-top: 8px;
  padding: 0 24px;
  color: #fff;
  &:hover {
    color: #fff;
  }
}
</style>
