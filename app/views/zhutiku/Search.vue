<template>
  <div class="zhutiku-search">
    <h1 class="zhutiku-search-slogan">主题投资，从未如此简单</h1>
    <div class="zhutiku-search-select-area">
      <multiselect
        track-by="plate_id"
        label='plate_name'
        placeholder="搜索你想看的主题"
        style="width: 320px"
        select-label=""
        selected-label=""
        deselect-label=""
        open-direction="bottom"
        :options="options"
        :searchable="true"
        :loading="loading"
        :clear-on-select="false"
        :close-on-select="true"
        :max-height="600"
        :show-no-results="true"
        @search-change="search"
        @select="onSelect"
      >
        <template slot="option" slot-scope="props">
          <span style="float: left">{{props.option.plate_name}}</span>
          <span style="float: right" :class="{
            [renderMarketColor(props.option.core_pcp)]: true
          }">{{props.option.core_pcp | numToRate}}</span>
        </template>
        <span slot="noResult">
          <div
            class="no-result"
          >
            <i class="iconfont icon-wupipeijieguo"></i>
            暂无匹配结果
          </div>
        </span>
        <span slot="caret">
          <i class="iconfont icon-sousuo"></i>
        </span>
      </multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { debounce } from 'underscore'
import { searchBkjByName } from '~/api/wows'
import { renderMarketColor } from '~/utils/helpers'

export default {
  components: {
    Multiselect
  },
  data () {
    return {
      options: [],
      loading: false
    }
  },
  methods: {
    renderMarketColor,
    search: debounce(function (query) {
      if (!query) return
      this.loading = true
      searchBkjByName({ limit: 10, q: query })
        .then((res) => {
          this.options = res.data
          this.loading = false
        })
    }, 250),
    onSelect (e) {
      if (e) {
        const url = `/theme/${e.plate_id}`
        //  hack，避免window.open被浏览器拦截
        const newWindow = window.open(url, '_blank')
        newWindow.location = url
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.zhutiku-search {
  width: 1200px;
  // height: 408px;
  margin: 0 auto;
  padding: 40px 0 25px;
  text-align: center;
  .zhutiku-search-select-trigger {
    display: block;
    width: 320px;
    margin: 0 auto;
  }
  &-slogan {
    margin-bottom: 15px;
    line-height: 20px;
    font-size: 20px;
  }
  &-select-area {
    width: 320px;
    margin: 0 auto;
  }
  .icon-sousuo {
    position: absolute;
    right: 10px;
    top: 8px;
    color: #e6394d;
  }
  .no-result {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 0 36px;
    color: #a6a6a6;
    .iconfont {
      font-size: 24px;
      color: red;
      margin-bottom: 10px;
    }
  }
}
</style>

<style lang="less">
.zhutiku-search {
  .multiselect__tags {
    border-radius: 0;
    border: 1px solid #e6394d;
    background: transparent;
  }

  .multiselect__input, .multiselect__single {
    background: transparent;
    color: #eee;
  }

  .multiselect__content-wrapper {
    border: none;
  }

  .multiselect__option--highlight {
    background: #e7e7e7;
    color: #333;
  }
}
</style>
