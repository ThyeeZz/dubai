import Login from '@/pages/login'
import Index from '@/pages/index'

const routes = [{
    path: '/',
    name: '',
    redirect: '/login',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: "index",
    component: Index,
    redirect: "/index/synthesize",
    children: [{
        path: '/index/synthesize',
        name: 'synthesize',
        component: resolve => require(['@/pages/synthesize'], resolve)
      },
      {
        path: '/index/activity',
        name: 'activity',
        component: () => import('@/pages/realtimeActivity')
      },
      {
        path: '/index/sleep',
        name: 'sleep',
        component: () => import('@/pages/sleepRest')
      },
      {
        path: '/index/reports',
        name: 'reports',
        component: () => import('@/pages/reports')
      },
      {
        path: '/index/system',
        name: 'system',
        component: () => import('@/pages/system'),
        redirect: '/index/system/company/search',
        children: [
          // 客户管理--------------------------------------------------
          {
            path: '/index/system/client/search',
            name: 'clientSearch',
            meta: {
              title: "Employee Query"
            },
            component: () => import('@/pages/systemPages/clientMng/ClientSearch')
          },
          {
            path: '/index/system/client/upload',
            name: 'clientUpload',
            meta: {
              title: "Employee Create"
            },
            component: () => import('@/pages/systemPages/clientMng/ClientUpload')
          },
          {
            path: '/index/system/client/edit',
            name: 'editclient',
            meta: {
              title: "Employee Modification"
            },
            component: () => import('@/pages/systemPages/clientMng/EditClient')
          },
          // 创建企业账号 ------------------------
          {
            path: '/index/system/account/create',
            name: 'createAccount',
            meta: {
              title: "Account Create"
            },
            component: () => import('@/pages/systemPages/accountMng/CreateAccount')
          },
          {
            path: '/index/system/account/search',
            name: 'accountSearch',
            meta: {
              title: "Account Query"
            },
            component: () => import('@/pages/systemPages/accountMng/AccountSearch')
          },

          // 部门管理 ------------------------------------------------------
          {
            path: '/index/system/depart/search',
            name: 'departSearch',
            meta: {
              title: "Department Query"
            },
            component: () => import('@/pages/systemPages/departsMng/DepartSearch')
          },
          {
            path: '/index/system/depart/upload',
            name: 'departUpload',
            meta: {
              title: "Department Create"
            },
            component: () => import('@/pages/systemPages/departsMng/DepartUpload')
          },

          // 网关管理 -------------------------------------------------------------
          {
            path: '/index/system/beacon/search',
            name: 'beaconSearch',
            meta: {
              title: "Gateway Query"
            },
            component: () => import('@/pages/systemPages/beaconConf/BeaconSearch')
          },

          {
            path: '/index/system/beacon/server',
            name: 'beaconServer',
            meta: {
              title: "Available Gateway Services Query"
            },
            component: () => import('@/pages/systemPages/beaconConf/BeaconServer')
          },
          // 公司管理 -----------------------------------------------
          {
            path: '/index/system/company/create',
            name: 'companyCreate',
            meta: {
              title: "Company Create"
            },
            component: () => import('@/pages/systemPages/companyMng/CompanyCreate')
          },
          {
            path: '/index/system/company/search',
            name: 'companySearch',
            meta: {
              title: "Company Query"
            },
            component: () => import('@/pages/systemPages/companyMng/CompanySearch')
          },
          // 区域管理 --------------------------------------------------
          {
            path: '/index/system/area/create',
            name: 'areaCreate',
            meta: {
              title: "Area Create"
            },
            component: () => import('@/pages/systemPages/areaMng/AreaCreate')
          },
          {
            path: '/index/system/area/search',
            name: 'areaSearch',
            meta: {
              title: "Area Query"
            },
            component: () => import('@/pages/systemPages/areaMng/AreaSearch')
          }
        ]
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/pages/test')
  },
  { // 当没有匹配到正确路由的时候，匹配notOpen组件
    path: '*',
    component: () => import('@/pages/notFound'),
    meta: {
      title: 'notFound' // true显示，false隐藏
    }
  }
]

export default routes
