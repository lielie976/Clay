<template>
  <section class="ztk-jinrifengkou-container">
    <widget-box title="今日盘中风口">
      <section class="ztk-jinrifengkou" id="ztk-jinrifengkou">
        <div class="ztk-jinrifengkou-content" v-for="(item, index) in trending" :key="item.plate_id">
          <div 
            :class="{
              'ztk-jinrifengkou-title': true,
              'ztk-jinrifengkou-title-main': index <= 2
            }"
          >
            <i :class="{iconfont: true, [`icon-0${index + 1}`]: true}"></i>
            <a :href="`/theme/${item.BkjId}`" target="_blank">{{item.Title}}</a>
          </div>
          <div class="ztk-jinrifengkou-rate">
            <!-- 暂时用板块的数据，切换板块集后换回来 -->
            <stocks :stocks="item.longtou" />
          </div>
        </div>
      </section>
    </widget-box>
  </section>
</template>

<script>
import WidgetBox from './WidgetBox'
import Stocks from './Stocks'

export default {
  components: {
    WidgetBox,
    Stocks
  },
  computed: {
    trending () {
      return this.$store.state.settings.trending
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.ztk-jinrifengkou {
  margin-top: 8px;
  background: #fff;
  border: 1px solid #efefef;
  &-title {
    margin-left: -10px;
    font-size: 16px;
    color: #363740;
    a {
      color: @mainFontColorHover;
    }
    &:hover {
      a {
        color: @mainFontColorHover;
      }
    }
    .iconfont {
      color: #d8d8d8;
      margin-right: 3px;
    }
    &-main {
      .iconfont {
        color: @stockUp;
      }
    }
  }
  &-rate {
    padding-left: 12px;
    margin-top: 5px;
  }
}

.ztk-jinrifengkou-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 78px;
  margin-left: 24px;
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
}

</style>

