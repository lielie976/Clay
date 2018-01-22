<template>
  <widget-box title="已购文章">
    <div>
      <template v-if="1">
        <non-login />
      </template>
      <template v-else>
        <ul class="aside-bought-msgs">
          <li class="aside-bought-msgs-item" v-for="msg in msgs" :key="msg.Id">
            <a :href="`/article/${msg.Id}`" target="_blank">{{msg.Title | truncate(35, '...')}}</a>
            <p class="aside-bought-msgs-bottom">
              <span class="aside-bought-msgs-item-subj">
                <img src="/img/tuoshui-banner.jpg">
                只做龙头
              </span>
              <span class="aside-bought-msgs-item-time">
                <time-widget :time="msg.CreatedAtInSec" />
              </span>
            </p>
          </li>
        </ul>
      </template>
    </div>
  </widget-box>
</template>

<script>
import NonLogin from '~/components/NonLogin'
import WidgetBox from '~/components/WidgetBox'
import TimeWidget from '~/components/TimeWidget'

export default {
  components: {
    NonLogin,
    WidgetBox,
    TimeWidget
  },
  props: {
    msgs: Array
  }
}
</script>

<style lang="less" scoped>
.aside-bought-msgs {
  background: #fff;
  padding-left: 16px;
  &-bottom {
    overflow: hidden;
    margin-top: 12px;
    line-height: 20px;
  }
  &-item {
    padding: 16px 16px 16px 0;
    &:not(:last-child) {
      border-bottom: 1px solid #efefef;
    }
    &-subj {
      float: left;
      font-size: 14px;
      color: #666;
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        vertical-align: middle;
      }
    }
    &-time {
      float: right;
    }
  }
}
</style>

