<template lang="pug">
.index-page
  <CurrencyConverter />
</template>

<script>
export default {
  name: 'IndexPage'
}
</script>

<style src="../assets/styles/defaults.scss" lang="scss"></style>
<style lang="scss">
.index-page {
  height: 100vh;
  max-height: 100vh;
  overflow-y: auto;
  font-family: $font-system-ui;
  color: $color-text-main;
  background-color: $color-gray-light;
}
</style>
