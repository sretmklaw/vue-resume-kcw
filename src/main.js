import './scss/style.scss'
import {useData} from "./composables/data.js"
import {useNavigation} from "./composables/navigation.js"
import {createAppRouter} from "./router/router.js"
import {createApp} from "vue"
import App from './vue/core/App.vue'

const data = useData()

data.fetchEssentials().then(r => {

    const navigation = useNavigation()
    navigation.init(data.getSections(), data.getCategories())

    const router = createAppRouter()
    createApp(App).use(router).mount('#app')
})