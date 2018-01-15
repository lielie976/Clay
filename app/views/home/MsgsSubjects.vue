<template>
  <div class="home-news-titlebar-filter">
    <span>
      <!-- <input
        type="checkbox"
        data-subjId="10"
        id="filter-dxw"
        name="filter-dxw"
        class="home-news-titlebar-filter-checkbox"
        :checked="isActive(10)"
        @change="e => selectFixedSubject({ value: e.target.checked, id: 10 })"
      />
      <label for="filter-dxw">大新闻</label> -->
      <Checkbox
        :value="isActive(10)"
        @on-change="value => selectFixedSubject({ value, id: 10 })"
      >
        大新闻
      </Checkbox>
    </span>
    <span>
      <!-- <input
        type="checkbox"
        data-subjId="723"
        id="filter-gg"
        name="filter-gg"
        class="home-news-titlebar-filter-checkbox"
        :checked="isActive(723)"
        @change="e => selectFixedSubject({ value: e.target.checked, id: 723 })"
      />
      <label for="filter-gg">公告</label> -->
      <Checkbox
        :value="isActive(723)"
        @on-change="value => selectFixedSubject({ value, id: 723 })"
      >
        公告
      </Checkbox>
    </span>
    <span>
      <!-- <input
        type="checkbox"
        data-subjId="35"
        id="filter-pzyd"
        name="filter-pzyd"
        class="home-news-titlebar-filter-checkbox"
        :checked="isActive(35)"
        @change="e => selectFixedSubject({ value: e.target.checked, id: 35 })"
      />
      <label for="filter-pzyd">盘中异动</label> -->
      <Checkbox
        :value="isActive(35)"
        @on-change="value => selectFixedSubject({ value, id: 35 })"
      >
        盘中异动
      </Checkbox>
    </span>
    <span>
      <!-- <input
        type="checkbox"
        data-subjId="469"
        id="filter-scjh"
        name="filter-scjh"
        class="home-news-titlebar-filter-checkbox"
        :checked="isActive(469)"
        @change="e => selectFixedSubject({ value: e.target.checked, id: 469 })"
      />
      <label for="filter-scjh">市场机会</label> -->
      <Checkbox
        :value="isActive(469)"
        @on-change="value => selectFixedSubject({ value, id: 469 })"
      >
        盘中异动
      </Checkbox>
    </span>
    <span>
      <!-- <input
        type="checkbox"
        id="filter-jd"
        name="filter-jd"
        class="home-news-titlebar-filter-checkbox"
        :checked="data.hasExplain"
        @change="toggleExplain"
      />
      <label for="filter-jd">解读</label> -->
      <Checkbox
        :value="data.hasExplain"
        @on-change="toggleExplain"
      >
        解读
      </Checkbox>
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  computed: {
    data () {
      return this.$store.state.homeMsgs
    }
  },
  methods: {
    ...mapActions({
      selectFixedSubject: 'homeMsgs/selectFixedSubject',
      toggleExplain: 'homeMsgs/toggleExplain'
    }),
    isActive (id) {
      return this.$store.state.homeMsgs.activeFixedSubjects.indexOf(id) > -1
    }
  }
}
</script>

<style lang="less" scoped>
.home-news-titlebar {
  &-filter {
    display: inline-block;
    // &-checkbox {
    //   display: none;
    //   &:checked ~ label {
    //     background: url(/img/724-checkbox/on.png) no-repeat;
    //     background-position-y: 1px;
    //   }
    // }
    // label {
    //   margin-right: 15px;
    //   padding-left: 15px;
    //   font-size: 12px;
    //   color: #666;
    //   cursor: pointer;
    //   background: url(/img/724-checkbox/off.png) no-repeat;
    //   background-position-y: 1px;
    // }
  }
}
</style>

