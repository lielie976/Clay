<template>
<div>
  <div v-if="index == 1" class="pool-toolbar-count inline-div">
    <span class="pool-toolbar-label">数量</span> <span class="pool-toolbar-count-number">{{stockList.length}}</span>
  </div>
  <div v-if="index == 1" class="pool-toolbar-filter inline-div">
    <span class="pool-toolbar-label">过滤新股</span>
    <div class="inline-div">
      <input :checked="filterChecked" @click="filterClick" type="checkbox" id="filter-switch" name="filter-switch" class="pool-toolbar-switch" />
      <label for="filter-switch"></label>
    </div>
  </div>
  <div v-if="index == 2" class="pool-toolbar-count inline-div">
    <span class="pool-toolbar-label">数量</span> <span class="pool-toolbar-count-number">{{stockList.length}}</span>
  </div>
  <div v-if="index == 3" class="pool-toolbar-scale inline-div">
    <span class="pool-toolbar-label pool-toolbar-scale-label-open">当天开板</span>
    <span class="pool-toolbar-label pool-toolbar-scale-label-turnover">换手率>2%</span>
  </div>
  <div v-if="index == 3" class="pool-toolbar-count inline-div">
    <span class="pool-toolbar-label">数量</span> <span class="pool-toolbar-count-number">{{stockList.length}}</span>
  </div>
  <div v-if="index == 4" class="pool-toolbar-count inline-div">
    <span class="pool-toolbar-label">数量</span> <span class="pool-toolbar-count-number">{{stockList.length}}</span>
  </div>
  <div v-if="index == 5" class="pool-toolbar-count inline-div">
    <span class="pool-toolbar-label">数量</span> <span class="pool-toolbar-count-number">{{stockList.length}}</span>
  </div>
</div>
</template>
<script>
/* eslint-disable */
export default {
  props: ["index","stockList"],
  data() {
    return {
      filterChecked:true
    };
  },

  mounted() {
    // console.log(this.index)
  },
  methods:{
    filterClick(){
      this.filterChecked = !this.filterChecked
      this.$emit('filterChange',this.filterChecked)
    }
  }
};
</script>
<style lang="less">
.ban-table-tab-toolbar {
  width: auto;
  height: 44px;
  flex-grow: 0;
  vertical-align: middle;
  padding-right: 20px;
  padding-top: 6px;
  color: #fff;
  > .inline-div {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
  .pool-toolbar-label {
    font-size: 12px;
    &.pool-toolbar-scale-label-open {
      margin-right: 30px;
      position: relative;
      &:before {
        content: "";
        display: block;
        position: absolute;
        left: -15px;
        top: 3px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #e6394d;
      }
    }
    &.pool-toolbar-scale-label-turnover {
      position: relative;
      &:before {
        content: "";
        display: block;
        position: absolute;
        left: -15px;
        top: 3px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #fa0;
      }
    }
  }
  .pool-toolbar-count-number {
    font-size: 18px;
    display: inline-block;
    min-width: 30px;
  }
  .pool-toolbar-switch {
    &:empty {
      display: none;
      ~ label {
        position: relative;
        display: inline-block;
        height: 18px;
        width: 40px;
        top: 3px;
        float: left;
        line-height: 18px;
        text-indent: 40px;
        cursor: pointer;
        &:before {
          position: absolute;
          display: block;
          top: 0;
          bottom: 0;
          left: 0;
          content: "";
          width: 40px;
          background-color: #efefef;
          border-radius: 9px;
          transition: all 100ms ease-in;
        }
        &:after {
          position: absolute;
          display: block;
          content: "";
          width: 16px;
          top: 1px;
          margin-left: 1px;
          height: 16px;
          background-color: #fff;
          border-radius: 8px;
          transition: all 100ms ease-in;
        }
      }
    }
    &:checked ~ label {
      &:before {
        background-color: #e6394d;
      }
      &:after {
        margin-left: 23px;
      }
    }
  }
}
</style>

