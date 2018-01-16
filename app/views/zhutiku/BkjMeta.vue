<template>
  <a 
    :class="{
      'bkj-meta bkj-meta-fair': true,
      [getClass]: true
    }"
    target="_blank"
    :href="item.Subj.BkjId ? `/theme/${item.Subj.BkjId}` : ''"
  >
    <div class="bkj-meta-title" :title="item.Subj.Title">
      <i
        :class="{
          'iconfont': true,
          ['icon-0' + (index + 1)]: true
        }"></i>
      <span>{{item.Subj.Title}}</span>
    </div>
    <div class="bkj-meta-rate">{{corePcp | numToRate}}</div>
  </a>

</template>

<script>
import { getPlateDetail } from '~/api/wows'

export default {
  props: {
    index: {
      type: Number
    },
    item: {
      type: Object
    }
  },
  data () {
    return {
      corePcp: null
    }
  },
  computed: {
    getClass () {
      if (this.corePcp > 0) {
        return '-market-bg--rise'
      } else if (this.corePcp < 0) {
        return '-market-bg--decline'
      } else {
        return '-market-bg--balance'
      }
    }
  },
  mounted () {
    getPlateDetail({ id: this.item.Subj.BkjId })
      .then((res) => {
        const corePcp = res.data.core_pcp
        this.corePcp = corePcp
      })
  }
}
</script>

<style lang="less" scoped>
.bkj-meta {
  display: block;
  height: 112px; //100%
  padding: 14px 14px 24px;
  color: #fff;
  transition: .4s;
  &:hover {
    box-shadow: 2px 2px 4px 0 rgba(51,51,51,0.20);
  }
  &-title .iconfont {
    margin-right: 5px;
  }
  &-rate {
    font-size: 24px;
    text-align: center;
    line-height: 24px;
    margin-top: 15px;
  }
}
</style>

