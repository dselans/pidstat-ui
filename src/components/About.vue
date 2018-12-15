<template>
  <div class="about">
    <span class="msg">{{ msg }}</span>
  </div>
</template>

<script>
export default {
  name: 'About',
  props: {
    msg: String
  }
}
</script>

<style scoped>
</style>
