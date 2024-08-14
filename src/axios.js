import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

// СПРОСИТЬ ЧАТА ЧТО ЭТО ЗНАЧИТ И КАК ЭТО РЕАЛИЗОВАТЬ В САМОМ AXIOS

export default instance