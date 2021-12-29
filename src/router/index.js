import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: () => import('@/components/Home.vue'),
    children: [
      {
        path: '/welcome',
        component: () => import('@/components/Welcome.vue')
      },
      {
        path: '/users',
        component: () => import('@/components/user/User.vue')
      },
      {
        path: '/roles',
        component: () => import('@/components/roles/Roles.vue')
      },
      {
        path: '/rights',
        component: () => import('@/components/roles/Rights.vue')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/Cate.vue')
      },
      {
        path: '/params',
        component: () => import('@/components/goods/Params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/components/goods/Goods.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  let toeknStr = window.sessionStorage.getItem('token')
  if (!toeknStr) return next('/login')
  next()
})

export default router
