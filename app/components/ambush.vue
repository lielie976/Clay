<template>
  <section class="ztk-jinrifengkou-container">
    <toolbox title="提前埋伏">
      <div class="ambush-body">
      <a :href="`/article/${msg.MsgId}`" class="ambush-item" target="_blank" v-for="msg in msgs" :key="msg.Id">
        <div class="ambush-item-title">
          <span class="ambush-item-title-text">{{ msg.Subj.Title }}</span>
          <span class="ambush-item-title-time">{{ msg.TimeDesc }}</span>
        </div>
          <div class="ambush-item-content ">
            <p :title="msg.Summary" class="line-clamp">
              {{ msg.Summary }}
            </p>
        </div>
      </a>
    </div>
    </toolbox>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import toolbox from './toolbox';
import stocks from './stocks';

export default {
  components: {
    toolbox,
    stocks
  },
  computed: mapGetters({
    msgs: 'settings/ambush'
  })
};
</script>

<style lang="less" scoped>
@import "../styles/variables.less";

.ambush-body {
  background: #fff;
  margin-top: 8px;
  .ambush-item {
    margin-left: 0;
    padding: 10px 15px 10px 30px;
    cursor: pointer;
    position: relative;
    display: block;
    &:last-child:after {
      background: none;
    }
    &:after {
      height: 1px;
      content: "";
      display: block;
      position: absolute;
      left: 20px;
      right: 0;
      bottom: 0;
      background: @border-color-light;
    }
    &:hover {
      background: #fafafa;
    }
    &:visited {
      color: #fff;
      .ambush-item-title {
        color: #666;
        .ambush-item-title-text {
          color: #666;
        }
      }
      .ambush-item-text {
        color: #666;
      }
      .ambush-item-time {
        color: #666;
      }
    }
    &-title {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: space-between;
      position: relative;
      text-align: left;
      &-text {
        color: @fc-primary;
        font-size: 16px;
        line-height: 30px;
        text-align: left;
      }
      &-time {
        text-align: right;
        color: @mainColorRed;
        font-size: 12px;
        float: right;
        line-height: 30px;
      }
      &:before {
        content: "";
        display: block;
        position: absolute;
        left: -16px;
        top: 12px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: @mainColorRed;
      }
    }
    &-content {
      font-size: 14px;
      padding: 5px 0;
      .line-clamp {
        color: @fc-gray;
        font-size: 14px;
        max-height: 48px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 24px;
        padding: 0;
        position: relative;
        top: 3px;
        border: none;
      }
    }
  }
}
</style>

