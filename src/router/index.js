import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import vrPano from '@/components/vrPano'
import test from '@/components/test'

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
      path: '/test',
      name: 'test',
      component: test
    }
  ]
})
