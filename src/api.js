import axios from "axios";

export const BASE_URL = 'https://noble-79d83ff80894.herokuapp.com';

let config = {
    baseURL: `${BASE_URL}/rest/productionService/`,
    timeout: 30000,
}

const instance = axios.create(config)

instance.interceptors.request.use(function (config) {
    let locale = localStorage.getItem('locale')
    
    console.log(locale)

    if (!locale || locale === 'null' || locale === 'undefined') {
        locale = 'ru'
    }

    const fullUrl = new URL(BASE_URL + config.url)
    fullUrl.searchParams.append('locale', locale)

    config.url = fullUrl.pathname + fullUrl.search

    return config
})

export default instance
