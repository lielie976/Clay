<template>
  <section class="home-ztk-container">
    <section class="home-ztk" id="home-ztk">
      <a 
        :class="{
          'home-ztk-content': true,
          [renderMarketColor(z.pcp)]: true
        }"
        :href="`/theme/${z.plate_id}`"
        target="_blank"
        v-for="z in zhutiku":key="z.plate_id"
      >
        <div class="home-ztk-title" :title="z.plate_name">{{ z.plate_name | truncate(7, '...') }}</div>
        <div class="home-ztk-rate">{{ z.pcp | numToRate}}</div>
      </a>
      
      <a class="home-ztk-more" href="/zhutiku" target="_blank">
        <i class="icon-xiangyou iconfont"></i>
      </a>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { renderMarketColor } from '~/utils/helpers'

export default {
  computed: mapGetters({
    zhutiku: 'zhutiku/homeZhutiku'
  }),
  methods: {
    renderMarketColor
  }
}
</script>

<style lang="less" scoped>
.home-ztk-container {
  background: #fff;
}

.home-ztk {
  display: flex;
  width: 1200px;
  margin: 0 auto;
  padding: 12px 0;
  background: #fff;
  &-title {
    font-size: 16px;
    color: #666666;
    padding: 0 2px;
  }
  &-rate {
    font-size: 24px;
    margin-top: -4px;
  }
}

.home-ztk-content {
  display: inline-block;
  text-align: center;
  flex: 0 0 145px;
  height: 72px;
  line-height: 36px;
  border-left: 1px solid #efefef;
}

.home-ztk-more {
  border-left: 1px solid #efefef;
  line-height: 72px;
  padding-left: 10px;
  color: #bcbcbc;
}
</style>
