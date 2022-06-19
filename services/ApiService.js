import Axios from 'axios'
import config from '@/config'

export default {
  /**
    * Получить список валют
    */
  getCurrencies () {
    return Axios.get(`${config.apiBaseUrl}/currencies`)
  },

  /**
    * Получить пары валют
    */
  getPairs () {
    return Axios.get(`${config.apiBaseUrl}/pairs`)
  },

  /**
    * Получить курс валютной пары
    * @param {string} base :: базовая валюта
    * @param {string} quote :: валюта котировки
    */
  getCourse (requestData = {}) {
    const { base, quote } = requestData

    return Axios.get(`${config.apiBaseUrl}/course?base=${base}&quote=${quote}`)
  },
}
