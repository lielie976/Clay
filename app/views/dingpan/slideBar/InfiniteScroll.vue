<template>
  <div class="container" v-if="state">
    <!-- <v-spinner v-if="'loading' === state" /> -->
    <div v-if="state === 'ended'" class="ended">不能再拖了，人家是有底线的 (ღˇ◡ˇღ)</div>
  </div>
</template>

<script>
  // import VSpinner from './Spinner.vue'
  /* eslint-disable */
  import { debounce } from 'underscore'

  export default {
    props: ['load','element'],

    data: () => ({
      state: ''
    }),

    mounted() {
      this.onscroll = () => {
          let self = this
          // console.log('scroll')
        if (self.state) return

        if (document.getElementById(this.element).scrollHeight - document.getElementById(this.element).scrollTop < 1000) {
          if(self.state != 'loading'){
            self.state = 'loading'
            self.load().then(state => {
              if (state === 'ended'){
                self.state = state
              }else{
                self.state = ''
              }
            })
          }

        }
      }
      document.getElementById(this.element).addEventListener('scroll', this.onscroll, { passive: true })
    },

    // beforeDestroy() {
    //   document.getElementById(this.element).removeEventListener('scroll', this.onscroll, { passive: true })
    // },

    methods: {
      reset() {
        this.state = ''
      },

      end() {
        this.state = 'ended'
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    height: 60px;
    text-align: center;
    padding: 18px;
  }

  .ended {
    font-size: 14px;
    line-height: 24px;
    color: #b7b7b5;
  }
</style>
