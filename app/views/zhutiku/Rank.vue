<template>
  <section class="zhutiku-sort">
    <section class="zhutiku-sort-asc">
      <h2 class="zhutiku-sort-title">涨幅榜</h2>
      <ul>
        <rank-item
          v-for="(bkj, index) in zhutiku.zhutikuDesc"
          :key="bkj.plate_id"
          :bkj="bkj"
          :index="index"
        />
      </ul>
    </section>
    <section class="zhutiku-sort-desc">
      <h2 class="zhutiku-sort-title">跌幅榜</h2>
      <ul>
        <rank-item
          v-for="(bkj, index) in zhutiku.zhutikuAsc"
          :key="bkj.plate_id"
          :bkj="bkj"
          :index="index"
        />
      </ul>
    </section>
  </section>
</template>

<script>
import RankItem from './RankItem'

export default {
  components: {
    RankItem
  },
  computed: {
    zhutiku () {
      return this.$store.state.zhutiku
    }
  }
}
</script>

<style lang="less" scoped>
.zhutiku-sort {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  width: 1200px;
  // height: 408px;
  margin: 0 auto;
  &-title {
    font-size: 14px;
    text-align: left;
    line-height: 1;
    margin-bottom: 8px;
  }
}

.zhutiku-sort-asc,
.zhutiku-sort-desc {
  // flex: 1;
  width: 596px;
  max-width: 596px;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.zhutiku-sort-asc {
  li {
    background: #F3564D;
  }
}

.zhutiku-sort-desc {
  li {
    background: #1CBF7B;
  }
}

</style>

