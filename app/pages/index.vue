<template>
  <section class="container">
    <indexes :value="indexes" />
    <div>
      <ul>
        <li v-for="msg in msgs" :key="msg.Id">
          <a :href="`/article/${msg.Id}`">{{ msg.Title }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { getPcMsgs } from '~/api/message'
import { getStockIndex } from '~/api/forex'
import Indexes from '~/views/home/indexes'

function extractStocksReal (data) {
  const real = {}
  for (var i in data) {
    if (i !== 'fields') {
      real[i] = {}
      data.fields.forEach((field, idx) => {
        real[i][field] = data[i][idx]
      })
    }
  }
  return real
}

export default {
  async asyncData (context) {
    const msgs = await getPcMsgs({ subjids: '9', limit: 30 })
    let indexes = await getStockIndex()
    indexes = extractStocksReal(indexes.data.snapshot)
    return {
      msgs: msgs.NewMsgs,
      indexes
    }
  },
  components: {
    Indexes
  },
  data () {
    return {
      msgs: []
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
