import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/flows',
    },
    {
      path: '/flows/:id?',
      name: 'flow-editor',
      component: () => import('@/views/flow-editor/FlowEditorPage.vue'),
    },
  ],
})

export default router
