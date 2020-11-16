import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import vrPano from '@/components/vrPano'
import searchBuild from '@/components/searchBuild'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/vrPano',
            name: 'vrPano',
            component: vrPano
        },
        {
            path: '/searchBuild',
            name: 'searchBuild',
            component: searchBuild
        }
    ]
})