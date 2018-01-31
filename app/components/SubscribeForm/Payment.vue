<template>
  <div class="payment-options">
    <p class="payment-header">购买选项</p>
    <ul>
      <li v-if="data.message">
        <pay-message-option :data="data" :select="selectMsg" />
      </li>
      <li v-for="(i, index) in data.selectedSubject.items" :key="i.Id">
        <pay-subject-option 
          :data="data"
          :item="i"
          :index="index"
          :select="() => selectSubject(index)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import PaySubjectOption from './PaySubjectOption'
import PayMessageOption from './PayMessageOption'

export default {
  components: {
    PaySubjectOption,
    PayMessageOption
  },
  props: {
    data: Object
  },
  methods: {
    selectMsg () {
      this.$store.commit('subscribe/selectMsg')
    },
    selectSubject (index) {
      this.$store.commit('subscribe/selectSubject', index)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.payment-options {
  .payment-header {
    color: @subFontColor;
    font-size: 14px;
  }
  ul {
    display: flex;
    margin: 12px -4px 0;
  }
  li {
    flex: 1;
    margin: 0 4px;
    max-width: 142px;
    height: 88px;
  }
}
</style>
