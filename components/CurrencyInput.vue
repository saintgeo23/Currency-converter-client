<script>
export default {
  name: 'CurrencyInput',

  props: {
    placeholder: String,
    calculatedAmount: String,
  },

  data () {
    return {
      isFocused: false,
      amount: this.calculatedAmount || '',
    }
  },

  watch: {
    calculatedAmount (newValue = '') {
      this.amount = newValue
    },
    amount (newStr, oldStr) {
      let newAmount = newStr.replace(/[^0-9.]/, '')

      const parts = newAmount.match(/([0-9]+)([.]{1}[0-9]{0,2})?|[.][0-9]/)

      if (!parts) {
        newAmount = ''
      } else {
        newAmount = `${parts[1]}${parts[2] || ''}`
      }

      this.amount = newAmount

      this.$emit('newValue', { amount: this.amount, isFocused: this.isFocused })
    },
  },

  methods: {
    setFocused () {
      this.isFocused = true
      this.selectValue()
    },

    setUnfocused () {
      this.isFocused = false
    },

    selectValue () {
      if (!this.$refs.input) {
        return
      }

      this.$refs.input.select()
    },
  }
}
</script>

<template lang="pug">
  .currency-input
    input.currency-input__field(
      type="text"
      ref="input"
      v-model="amount"
      :placeholder="placeholder"
      @focus="setFocused"
      @blur="setUnfocused"
    )
</template>

<style lang="scss">
.currency-input {
  &__field {
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
    height: 48px;
    font-family: $font-system-ui;
    font-size: 16px;
    line-height: 48px;
    border: 1px solid $color-gray-middle;
    border-right: 0;
    border-radius: 4px 0 0 4px;
  }
}
</style>
