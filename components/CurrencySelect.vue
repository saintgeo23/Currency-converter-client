<script>
export default {
  name: 'CurrencySelect',

  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
  },

  data () {
    return { currentValue: this.value }
  },

  computed: {
    selectedValue: {
      get () {
        return this.value
      },
      set (newValue) {
        this.setValue(newValue)
      }
    },
  },

  methods: {
    setValue (newValue) {
      this.currentValue = newValue
      this.$emit('input', this.currentValue)
    },
  },
}
</script>

<template lang="pug">
.currency-select
  select.currency-select__field(
    v-model="selectedValue"
  )
    option.currency-select__option(
      v-for="(option, index) in options"
      :key="`select_option_${index}`"
    ) {{ option }}

  svg.currency-select__icon(
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    width="18"
    height="18"
    stroke-width="2"
  )
    polyline(points="6 9 12 15 18 9")
</template>

<style lang="scss">
.currency-select {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  background-color: $color-accent-main;

  &:hover {
    background-color: darken($color-accent-main, 10%);
  }

  &__field {
    box-sizing: border-box;
    display: block;
    width: 100px;
    height: 100%;
    padding: 0 40px 0 16px;
    font-family: $font-system-ui;
    font-size: 16px;
    font-weight: bold;
    color: $color-white;
    text-align: center;
    text-transform: uppercase;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  &__icon {
    position: absolute;
    top: 50%;
    right: 16px;
    pointer-events: none;
    stroke: $color-white;
    transform: translateY(-50%);
  }
}
</style>
