<script>
export default {
  name: 'AppConfirmation',

  props: {
    base: String,
    quote: String,
  },

  computed: {
    subheaderPhrase () {
      return `You've just successfully exchanged ${this.base} to ${this.quote}.`
    },
  },

  methods: {
    emitClose () {
      this.$emit('close')
    }
  },
}
</script>

<template lang="pug">
.app-confirmation
  .app-confirmation__wrapper
    .app-confirmation__header Congratulations!
    .app-confirmation__subheader {{ subheaderPhrase }}

    a.app-confirmation__close(
      @click="emitClose"
    ) Close
</template>

<style lang="scss">
.app-confirmation {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: $color-white;
  text-align: center;
  background-color: $color-accent-main;
  border-radius: 8px;

  &__header {
    font-size: 56px;
    font-weight: bold;
    text-align: center;
  }

  &__subheader {
    font-size: 22px;
    line-height: 30px;
    text-align: center;
  }

  &__header + &__subheader {
    margin-top: 32px;
  }

  &__close {
    box-sizing: border-box;
    display: inline-block;
    height: 48px;
    padding: 0 24px;
    line-height: 46px;
    font-size: 16px;
    font-weight: bold;
    color: $color-white;
    text-align: center;
    vertical-align: middle;
    background-color: transparent;
    border: 1px solid $color-white;
    border-radius: 4px;
  }

  &__close:hover {
    color: $color-accent-main;
    background-color: $color-white;
  }

  &__subheader + &__close {
    margin-top: 64px;
  }
}
</style>
