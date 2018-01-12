<template>
  <li>
    {{ msg.Title }}
  </li>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object
    }
  }
}
</script>