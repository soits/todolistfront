import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home'
import TodoApp from '~/views/TodoApp'

Vue.use(VueRouter)

const routes = [
  // config
  {
    // route 객체 name을 지정해줄 수 있다.
    name: 'index',
    path: '/',
    component: Home
  },
  {
    name: 'todos',
    path: '/todos',
    component: TodoApp,
    children: [
      {
        name: 'todos-filter',
        path: ':id'
      }
    ]
  }
]

export default new VueRouter({
  // mode: 'history', // localhost:8080/로 접근가능
  base: process.env.BASE_URL,
  routes
})
