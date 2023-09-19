
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', name:'home' ,component: () => import('pages/IndexPage.vue') },
      { path:'/myApplies/:id', name:'myApplies',component:() => import('pages/myApplies.vue')},
      { path:'/applyDetail/:id',name:'applyDetail',component:() => import('pages/applyDetail.vue')},
      { path:'/adminPanel/:id',name:'adminPanel',component:() => import('pages/adminPanelPage.vue')},
      { path:'/updateApply/:id',name:'updateApply',component:() => import('pages/updateApply.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
