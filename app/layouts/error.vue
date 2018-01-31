<template>
  <div>
    <section class="Landscape">
      <h1 class="Landscape__Title">
        {{ error.statusCode }}
      </h1>
      <h2 class="Landscape__SubTitle">
        {{ errorMessage }}
      </h2>
      <ul class="Landscape__List">
        <li class="Landscape__List__Item">
          <nuxt-link v-if="error.statusCode === 404" class="button button--green" to="/">
            回到首页
          </nuxt-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  props: ['error'],
  computed: {
    errorMessage () {
      return ({
        404: '您访问的页面不存在。',
        500: '服务器开小差啦，请稍后再试。'
      })[this.error.statusCode] || this.error.message
    }
  }
}
</script>

<style lang="less" scoped>
.Landscape
{
  min-height: 100vh;
  padding: 50px 15px;
  padding-top: 120px;
  text-align: center;
  @media (min-width: 991px)
  {
    padding: 100px 30px;
    padding-top: 180px;
  }
  &__Title
  {
    font-weight: 300;
    letter-spacing: 1px;
    margin: 20px 0;
    color: #35495e;
    font-size: 128px;
    line-height: 100px;
  }
  &__SubTitle
  {
    letter-spacing: 1px;
    line-height: normal;
    margin: 20px 0;
    color: #35495e;
    font-size: 30px;
  }
  &__List
  {
    list-style: none;
    margin: 0;
    padding: 0;
    &__Item
    {
      display: inline-block;
      padding: 0 15px 20px 15px;
      padding-bottom: 0;
      a {
        color: #35495e;
      }
      .button
      {
        font-size: 16px;
      }
    }
  }
}
</style>