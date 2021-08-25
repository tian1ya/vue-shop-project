import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守护
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径中跳过来的
  // next() 放行， next(url) 强制跳转
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) next('/login')
  next()
})
export default router
