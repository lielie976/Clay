<template>
  <div>
    <theme-title />
    <!-- <theme-intro @mutate-intro="mutateIntro" @show-modal="modal = true" :modal.sync="modal" :intro.sync="intro" /> -->
    <zhuti-chart />
    <theme-modal @mutate-intro="mutateIntro" @hide-modal="modal = false" :modal.sync="modal" :intro.sync="intro" />
  </div>
</template>

<script>
import themeTitle from '~/views/theme/themeTitle'
import zhutiChart from '~/views/zhuti/zhutiChart'
import themeModal from '~/views/theme/themeModal'

export default {
  async asyncData ({ store, params, req }) {
    await store.dispatch('theme/getThemeInfo', {
      id: params.id
    });
    await store.dispatch('theme/getThemeMessage', params.id);
    await store.dispatch('theme/getPlateSetInfo', params.id);
    // await store.dispatch('theme/getThemeStock')
    await store.dispatch('theme/getBkjInfo')
    await store.dispatch('theme/getStockFlow')
    await store.dispatch('theme/getLongtou', params.id)
    return {
      intro: {},
      modal: false,
      id: params.id,
      timer: 0
    }
  },
  head () {
    return {
      title: ``,
      meta: [
        {
          hid: `description`,
          name: 'description',
          content: ``
        }
      ]
    }
  },
  methods: {
    mutateIntro (item) {
      this.intro = this.intro.map(i => {
        if (i.Question === item.Question) {
          i.selected = true
        } else {
          i.selected = false
        }
        return i
      })
    },
    refresh () {
      this.stopInterval()
      this.startInterval()
    },
    startInterval () {
      this.$store.dispatch('theme/getThemeStock')
      this.timer = setInterval(() => {
        this.$store.dispatch('theme/getThemeStock')
      }, 20000)
    },
    stopInterval () {
      clearInterval(this.timer)
    }
  },
  mounted () {
    let introData = []
    try {
      let intro = JSON.parse(JSON.stringify(this.$store.state.theme.themeInfo.QuestionAnswers))
      if (intro && intro.length) {
        introData = intro.map(item => {
          item.selected = false
          item.HtmlAnswer = item.HtmlAnswer.replace(/< img .*?>/g, '')
          // console.log(item.HtmlAnswer)
          item.HtmlAnswer = item.HtmlAnswer.replace(/class=".+?"/g, '')
          return item
        })
        introData[0].selected = true
      }
    } catch (error) {
      introData = []
    }
    this.intro = introData
  },
  components: {
    themeTitle,
    zhutiChart,
    themeModal
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

</style>

<style lang="less">
@import '../../styles/variables.less';

</style>
