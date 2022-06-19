<!-- Please remove this file from your project -->
<script>
import ApiService from '../services/ApiService'

export default {
  name: 'CurrencyConverter',

  data () {
    return {
      currencies: null,
      pairs: null,
      baseCurrency: null,
      quoteCurrency: null,
      isInitializing: false,
      course: null,
    }
  },

  computed: {
    headerPhrase () {
      return `Exchange ${this.baseCurrency} to ${this.quoteCurrency}`
    },
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      this.isInitializing = true
      const currenciesPromise = ApiService.getCurrencies()
      const pairsPromise = ApiService.getPairs()

      Promise.all([currenciesPromise, pairsPromise])
        .then(([currenciesData, pairsData]) => {
          if (currenciesData.data && currenciesData.data.currencies) {
            this.currencies = currenciesData.data.currencies
            this.baseCurrency = this.currencies[0]
            this.quoteCurrency = this.currencies[1]
          }

          if (pairsData.data && pairsData.data.pairs) {
            this.pairs = currenciesData.data.pairs
          }

          this.isInitializing = false
          this.getCurrentCourse()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    getCurrentCourse () {
      this.isLoadingCourse = true
      const base = this.baseCurrency
      const quote = this.quoteCurrency

      ApiService.getCourse({ base, quote })
        .then(({ data }) => {
          if (data) {
            if (data && data.course && data.course.base_currency === base && data.course.quote_currency === quote) {
              this.course = data.course.course
            } else {
              this.course = null
            }
          } else {
            this.course = null
          }
          this.isLoadingCourse = false
        })
        .catch((err) => {
          console.log(err)
          this.course = null
          this.isLoadingCourse = false
        })
    },
  }
}
</script>

<template lang="pug">
.currency-converter
  .currency-converter__wrapper
    .currency-converter__container
      template(v-if="isInitializing")
        <AppPreloader />

      template(v-else)
        h1.currency-converter__header {{ headerPhrase }}
</template>

<style lang="scss">
.currency-converter {
  height: 100%;

  &__wrapper {
    box-sizing: border-box;
    height: 100%;
    padding: 16px;
  }

  &__container {
    width: 100%;
    max-width: $w-max-content;
    padding: 20px;
    margin: 0 auto;
    background-color: $color-white;
    box-shadow: 5px 10px 10px rgba($color-black, 0.2);
    border: 1px solid $color-gray-middle;
    border-radius: 8px;
  }
}
</style>
