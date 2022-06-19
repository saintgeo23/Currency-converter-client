<script>
export default {
  name: 'AppPreloader',
}
</script>

<template lang="pug">
.app-preloader
  svg.app-preloader__icon(
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="20"
    height="20"
    stroke-width="2"
  )
    line(
      x1="12"
      y1="2"
      x2="12"
      y2="6"
    )
    line(
      x1="12"
      y1="18"
      x2="12"
      y2="22"
    )
    line(
      x1="4.93"
      y1="4.93"
      x2="7.76"
      y2="7.76"
    )
    line(
      x1="16.24"
      y1="16.24"
      x2="19.07"
      y2="19.07"
    )
    line(
      x1="2"
      y1="12"
      x2="6"
      y2="12"
    )
    line(
      x1="18"
      y1="12"
      x2="22"
      y2="12"
    )
    line(
      x1="4.93"
      y1="19.07"
      x2="7.76"
      y2="16.24"
    )
    line(
      x1="16.24"
      y1="7.76"
      x2="19.07"
      y2="4.93"
    )

  span.app-preloader__label Loading...
</template>

<style lang="scss">
.app-preloader {
  height: 24px;
  overflow: hidden;
  text-align: center;

  &__icon {
    display: inline-block;
    vertical-align: middle;
    stroke: $color-text-main;

    @include animate-spin-slow();
  }

  &__icon + &__label {
    display: inline-block;
    margin-left: 6px;
    vertical-align: middle;
  }
}
</style>
