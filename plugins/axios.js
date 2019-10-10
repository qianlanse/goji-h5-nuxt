export default function({ app, $axios, redirect }) {
    $axios.onRequest((config) => {
        /* if (store && store.state.user.token) {
            config.headers.Authorization = 'Bearer ' + store.state.user.token
        } */
        return config
    })
    $axios.onResponse((response) => {
        const data = response.data
        if (!data.success) {
            return
        }
        if (data.code === 401 || data.code === '401') {
            app.$cookies.remove('GOIJI-WEBSITE-TOKEN')
        }
        return data
    })
    $axios.onError((error) => {
        // 请求错误请稍后再试
        const code = parseInt(error.response && error.response.status)
        if (code === 404) {
            redirect('/404')
        }
    })
}
