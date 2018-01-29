<template>
  <div>
   222
  </div>
</template>

<script>
export default {
  async asyncData ({ store, params, req }) {
    return {
      id: params.id
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
  },
  mounted () {

  },
  components: {
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

</style>

<style lang="less">
@import '../../styles/variables.less';

</style>
