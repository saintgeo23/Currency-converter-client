<!-- Please remove this file from your project -->
<script>
import ApiService from '../services/ApiService'

const RELOADING_TIMEOUT = 30000

export default {
  name: 'CurrencyConverter',

  data () {
    return {
      currencies: null,
      pairs: null,
      baseCurrency: null,
      baseAmount: '',
      quoteCurrency: null,
      quoteAmount: '',
      isInitializing: false,
      isExchanged: false,
      ignoreBaseChanged: false,
      ignoreQuoteChanged: false,
      course: null,
      reloadingTimeoutId: null,
    }
  },

  computed: {
    commission () {
      if (!this.pairs) {
        return 0
      }

      const pair = this.pairs.find(p => p.base_currency === this.baseCurrency && p.quote_currency === this.quoteCurrency)

      if (!pair) {
        return 0
      }

      return +pair.commission || 0
    },

    headerPhrase () {
      return `Exchange ${this.baseCurrency} to ${this.quoteCurrency}`
    },

    isSubmitDisabled () {
      return !this.baseCurrency ||
        !this.quoteCurrency ||
        this.baseCurrency === this.quoteCurrency ||
        !this.baseAmount ||
        +this.baseAmount <= 0 ||
        !this.quoteAmount ||
        +this.quoteAmount <= 0 ||
        !this.course
    },
  },

  watch: {
    baseCurrency () {
      if (this.ignoreBaseChanged) {
        this.ignoreBaseChanged = false
        return
      }

      this.getCurrentCourse().then(this.setCalculatedQuote)
    },
    quoteCurrency () {
      if (this.ignoreQuoteChanged) {
        this.ignoreQuoteChanged = false
        return
      }

      this.getCurrentCourse().then(this.setCalculatedQuote)
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

          if (pairsData.data && pairsData.data.currencyPairs) {
            this.pairs = pairsData.data.currencyPairs
          }

          this.isInitializing = false
          this.getCurrentCourse()
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
    },

    getCurrentCourse () {
      const base = this.baseCurrency
      const quote = this.quoteCurrency

      if (!base || !quote) {
        return Promise.reject(new Error('Choose valid base and quote currencies'))
      }

      return new Promise((resolve, reject) => {
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

            this.launchReloading()

            resolve()
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(err)
            this.course = null

            reject(new Error('Getting course has failed'))
          })
      })
    },

    launchReloading () {
      if (this.reloadingTimeoutId) {
        clearInterval(this.reloadingTimeoutId)
      }

      this.reloadingTimeoutId = setTimeout(() => {
        this.getCurrentCourse().then(this.setCalculatedQuote)
      }, RELOADING_TIMEOUT)
    },

    switchCurrencies () {
      this.ignoreBaseChanged = true
      this.ignoreQuoteChanged = true

      const oldQuoteCurrency = this.quoteCurrency
      this.quoteCurrency = this.baseCurrency
      this.baseCurrency = oldQuoteCurrency

      this.getCurrentCourse().then(this.setCalculatedQuote)
    },

    executeExchange () {
      if (this.isSubmitDisabled) {
        return
      }

      this.reset()
      this.isExchanged = true
    },

    clearConfirmation () {
      this.isExchanged = false
    },

    reset () {
      this.baseAmount = ''
      this.quoteAmount = ''
    },

    setBaseAmount (payload = {}) {
      if (payload.isFocused) {
        this.baseAmount = payload.amount || ''

        this.setCalculatedQuote()
      }
    },

    setQuoteAmount (payload = {}) {
      if (payload.isFocused) {
        this.quoteAmount = payload.amount || ''

        this.setCalculatedBase()
      }
    },

    setCalculatedQuote () {
      if (!this.course || this.baseAmount === '') {
        this.quoteAmount = ''
        return
      }

      const base = +this.baseAmount

      this.quoteAmount = `${base * this.course * ((100 - this.commission) / 100)}`
    },

    setCalculatedBase () {
      if (!this.course || this.quoteAmount === '') {
        this.baseAmount = ''
        return
      }

      const quote = +this.quoteAmount

      this.baseAmount = `${quote / ((100 - this.commission) / 100) / this.course}`
    },
  }
}
</script>

<template lang="pug">
.currency-converter
  .currency-converter__wrapper
    .currency-converter__container
      transition(name="fade")
        .currency-converter__confirmation(v-if="isExchanged")
          app-confirmation(
            :base="baseCurrency"
            :quote="quoteCurrency"
            @close="clearConfirmation"
          )

      template(v-if="isInitializing")
        app-preloader

      template(v-else)
        h1.currency-converter__header {{ headerPhrase }}

        .currency-converter__form(
          v-if="currencies && pairs"
        )
          h4.currency-converter__subheader You pay

          .currency-converter__line
            .currency-converter__part.currency-converter__part_left
              currency-input(
                placeholder="Pay amount"
                :calculated-amount="baseAmount"
                @newValue="setBaseAmount"
              )
            .currency-converter__part.currency-converter__part_right
              currency-select(
                v-model="baseCurrency"
                :options="currencies.filter(c => c !== quoteCurrency)"
              )

          .currency-converter__switcher
            currency-switcher(
              @switch="switchCurrencies"
            )

          h4.currency-converter__subheader You get

          .currency-converter__line
            .currency-converter__part.currency-converter__part_left
              currency-input(
                placeholder="Get amount"
                :calculated-amount="quoteAmount"
                @newValue="setQuoteAmount"
              )
            .currency-converter__part.currency-converter__part_right
              currency-select(
                v-model="quoteCurrency"
                :options="currencies.filter(c => c !== baseCurrency)"
              )

          a.currency-converter__submit(
            @click="executeExchange"
            :class="{ 'currency-converter__submit_disabled': isSubmitDisabled }"
          ) Exchange
</template>

<style lang="scss">
.currency-converter {
  height: 100%;
  user-select: none;

  &__wrapper {
    box-sizing: border-box;
    height: 100%;
    padding: 16px;
  }

  &__container {
    position: relative;
    width: 100%;
    max-width: $w-max-content;
    padding: 40px 28px 64px;
    margin: 0 auto;
    background-color: $color-white;
    box-shadow: 5px 10px 10px rgba($color-black, 0.2);
    border: 1px solid $color-gray-middle;
    border-radius: 8px;
  }

  &__header {
    padding-bottom: 24px;
    border-bottom: 1px solid $color-gray-middle;
  }

  &__header + &__form {
    margin-top: 32px;
  }

  &__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: hidden;
    border-radius: 4px;
  }

  &__subheader + &__line {
    margin-top: 12px;
  }

  &__switcher {
    text-align: right;
  }

  &__line + &__switcher {
    margin-top: 30px;
  }

  &__switcher + &__subheader {
    margin-top: 0;
  }

  &__part_left {
    flex: 1 1 100%;
  }

  &__part_right {
    flex: 0 0 100px;
  }

  &__submit {
    display: block;
    height: 48px;
    font-size: 16px;
    font-weight: bold;
    line-height: 48px;
    color: $color-white;
    text-align: center;
    background-color: $color-accent-main;
    border-radius: 4px;
  }

  &__submit:hover {
    background-color: darken($color-accent-main, 10%);
  }

  &__submit_disabled,
  &__submit_disabled:hover {
    cursor: not-allowed;
    background-color: darken($color-gray-middle, 10%);
  }

  &__line + &__submit {
    margin-top: 48px;
  }

  &__confirmation {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
