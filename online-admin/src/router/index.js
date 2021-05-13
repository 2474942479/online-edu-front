import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '假老外后台首页', icon: 'dashboard' }
    }]
  }]
/**
* 动态路由
*/
export const asyncRoutes = [


  // 讲师管理路由
  {
    path: '/teacher',     //一级路径
    component: Layout,    //布局
    redirect: '/teacher/list',   //访问path后的默认地址
    name: '讲师管理',    //路由一级名称   icon为图片
    meta: { title: '讲师管理', icon: 'example' },
    children: [
      {
        path: 'list',    //二级路径
        name: '讲师列表',
        component: () => import('@/views/teacher/list.vue'),//该路由对应的页面
        meta: { title: '讲师列表', icon: 'table' }
      },

      {
        path: 'save',
        name: '新增讲师',
        component: () => import('@/views/teacher/save.vue'),
        meta: { title: '新增讲师', icon: 'tree' }
      },
      //编辑方法一  hidden 隐藏路由   :id   占位符  
      {
        path: 'edit/:id',
        name: '编辑讲师',
        component: () => import('@/views/teacher/save.vue'),
        meta: { title: '编辑讲师', icon: 'tree' },
        hidden: true
      },


    ]
  },

  {
    path: '/subject',     //一级路径
    component: Layout,    //布局
    redirect: '/subject/list',   //访问path后的默认地址
    name: '课程分类管理',    //路由一级名称   icon为图片
    meta: { title: '课程分类管理', icon: 'example' },
    children: [
      {
        path: 'list',    //二级路径
        name: '课程分类列表',
        component: () => import('@/views/course/subject/list.vue'),//该路由对应的页面
        meta: { title: '课程分类列表', icon: 'tree' }
      },

    ]
  },

  {
    path: '/course',     //一级路径
    component: Layout,    //布局
    redirect: '/course/list',   //访问path后的默认地址
    name: '课程管理',    //路由一级名称   icon为图片
    meta: { title: '课程管理', icon: 'example' },
    children: [
      {
        path: 'list',    //二级路径
        name: '课程列表',
        component: () => import('@/views/course/list.vue'),//该路由对应的页面
        meta: { title: '课程列表', icon: 'tree' }
      },

      {
        path: 'info',
        name: '发布课程',
        component: () => import('@/views/course/info.vue'),
        meta: { title: '发布课程', icon: 'tree' }
      },
      {
        path: 'info/:courseId',
        name: '编辑课程基本信息',
        component: () => import('@/views/course/info.vue'),
        meta: { title: '编辑课程基本信息', icon: 'tree' },
        hidden: true
      },
      {
        path: 'chapter/:courseId',
        name: '编辑课程大纲',
        component: () => import('@/views/course/chapter.vue'),
        meta: { title: '编辑课程大纲', icon: 'tree' },
        hidden: true
      },
      {
        path: 'finalrelease/:courseId',
        name: '最终发布',
        component: () => import('@/views/course/finalrelease.vue'),
        meta: { title: '最终发布', icon: 'tree' },
        hidden: true
      },
      {
        path: '/course/subject/list',    
        name: '课程分类列表',
        component: () => import('@/views/course/subject/list.vue'),//该路由对应的页面
        meta: { title: '课程分类列表', icon: 'tree' }
      }

    ]
  },

  // {
  //   path: '/banner',     //一级路径
  //   component: Layout,    //布局
  //   redirect: '/banner/list',   //访问path后的默认地址
  //   name: '首页幻灯片管理',    //路由一级名称   icon为图片
  //   meta: { title: '首页幻灯片管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'list',    //二级路径
  //       name: '幻灯片列表',
  //       component: () => import('@/views/teacher/list.vue'),//该路由对应的页面
  //       meta: { title: '幻灯片列表', icon: 'table' }
  //     },

  //     {
  //       path: 'save',
  //       name: '新增幻灯片',
  //       component: () => import('@/views/teacher/save.vue'),
  //       meta: { title: '新增幻灯片', icon: 'tree' }
  //     },
  //     //编辑方法一  hidden 隐藏路由   :id   占位符  
  //     {
  //       path: 'edit/:id',
  //       name: '编辑幻灯片',
  //       component: () => import('@/views/teacher/save.vue'),
  //       meta: { title: '编辑幻灯片', icon: 'tree' },
  //       hidden: true
  //     },


  //   ]
  // },

  {
    path: '/statistics/daily',
    component: Layout,
    redirect: '/statistics/daily/show',
    name: '统计分析',
    meta: { title: '统计分析', icon: 'example' },
    children: [
      {
        path: 'show',
        name: '图表显示',
        component: () => import('@/views/statistics/daily/show'),
        meta: { title: '图表显示' }
      },
      {
        path: 'create',
        name: '生成统计',
        component: () => import('@/views/statistics/daily/create'),
        meta: { title: '生成统计' }
      }

    ]
  },

  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    name: '权限管理',
    meta: { title: '权限管理', icon: 'chart' },
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: () => import('@/views/acl/user/list'),
        meta: { title: '用户管理' }
      },
      {
        path: 'role/list',
        name: '角色管理',
        component: () => import('@/views/acl/role/list'),
        meta: { title: '角色管理' }
      },
      {
        path: 'role/form',
        name: '角色添加',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色添加' },
        hidden: true
      },
      {
        path: 'role/update/:id',
        name: '角色修改',
        component: () => import('@/views/acl/role/form'),
        meta: { title: '角色修改' },
        hidden: true
      },
      {
        path: 'role/distribution/:id',
        name: '角色权限',
        component: () => import('@/views/acl/role/roleForm'),
        meta: { title: '角色权限' },
        hidden: true
      },
      {
        path: 'menu/list',
        name: '菜单管理',
        component: () => import('@/views/acl/menu/list'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'user/add',
        name: '用户添加',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户添加' },
        hidden: true
      },
      {
        path: 'user/update/:id',
        name: '用户修改',
        component: () => import('@/views/acl/user/form'),
        meta: { title: '用户修改' },
        hidden: true
      },
      {
        path: 'user/role/:id',
        name: '用户角色',
        component: () => import('@/views/acl/user/roleForm'),
        meta: { title: '用户角色' },
        hidden: true
      }

    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// export default new Router({
//   // mode: 'history', //后端支持可开
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

export default router