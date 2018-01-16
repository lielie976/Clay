<template>
  <li 
    :class="{
      'zhutiku-sort-bkj': true,
      'hint--bottom': index > 2
    }"
    :data-url="bkj.plate_id"
    :style="{background: getBkjSortBg(bkj.pcp)}"
    :aria-label="bkj.plate_name"
  >
    <a :href="`/theme/${bkj.plate_id}`" target="_blank">
      <h3 class="zhutiku-sort-bkj-title">
        <template v-if="index > 2">
          {{bkj.plate_name | truncate(7, '...')}}
        </template>
        <template v-else>
          {{bkj.plate_name}}
        </template>
      </h3>
      <p class="zhutiku-sort-bkj-rate">{{ bkj.pcp | numToRate }}</p>
    </a>
  </li>
</template>

<script>
const getBkjSortBg = (pcp, type) => {
  if (pcp === 0) {
    return 'rgba(216, 216, 216, 0.5)'
  }
  const isAsc = pcp >= 0
  pcp = isAsc ? pcp : -pcp
  if (pcp >= 5) {
    return isAsc ? 'rgba(242, 86, 78, 1)' : 'rgba(28, 191, 123, 1)'
  } else if (pcp >= 3 && pcp < 5) {
    return isAsc ? 'rgba(242, 86, 78, 0.85)' : 'rgba(28, 191, 123, 0.85)'
  } else if (pcp >= 1 && pcp < 3) {
    return isAsc ? 'rgba(242, 86, 78, 0.75)' : 'rgba(28, 191, 123, 0.75)'
  } else if (pcp > 0 && pcp < 1) {
    return isAsc ? 'rgba(242, 86, 78, 0.65)' : 'rgba(28, 191, 123, 0.65)'
  }
}

export default {
  props: {
    bkj: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    getBkjSortBg
  }
}
</script>

<style lang="less" scoped>
.zhutiku-sort-bkj {
    transition: .5s;
    flex: 0 0 96px;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 96px;
      height: 64px;
      color: #fff;
    }
    &:hover {
      transform: scale(1.04);
      &[data-type="asc"] {
        background: rgba(242, 86, 78, 1) !important;
      }
      &[data-type="desc"] {
        background: rgba(28, 191, 123, 1) !important;
      }
    }
    &-title {
      font-size: 12px;
    }
    &-rate {
      font-size: 16px;
    }
    &:nth-child(-n + 3) {
      margin-bottom: 4px;
      flex: 0 0 196px;
      a {
        width: 196px;
        height: 128px;
        .zhutiku-sort-bkj-title {
          font-size: 16px;
        }
        .zhutiku-sort-bkj-rate {
          font-size: 24px;
        }
      }
    }
  }
</style>

