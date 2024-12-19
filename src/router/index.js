import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ListeApprenants from '@/components/apprenants/ListeApprenants.vue'
import AjouterApprenant from '@/components/apprenants/AjouterApprenant.vue'
import ModifierApprenant from '@/components/apprenants/ModifierApprenant.vue'
import ModifierModule from '@/components/modules/ModifierModule.vue'
import AjouterModule from '@/components/modules/AjouterModule.vue'
import ListeModule from '@/components/modules/ListeModule.vue'
import ListeInscription from '@/components/inscriptions/ListeInscription.vue'
import AjouterInscription from '@/components/inscriptions/AjouterInscription.vue'
import ModifierInscription from '@/components/inscriptions/ModifierInscription.vue'

import ListPayments from '@/components/payments/ListPayments.vue'
import AddPayment from '@/components/payments/AddPayment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/apprenants',
      name: 'gestion-apprenants',
      component: ListeApprenants,
    },
    {
      path: '/apprenant/ajouter',
      name: 'ajout-apprenant',
      component: AjouterApprenant,
    },
    {
      path: '/apprenant/modifier/:id',
      name: 'modifier-apprenant',
      component: ModifierApprenant,
    },
    {
      path: '/modules',
      name: 'gestion-modules',
      component: ListeModule,
    },
    {
      path: '/module/ajouter',
      name: 'ajout-module',
      component: AjouterModule,
    },
    {
      path: '/module/modifier/:id',
      name: 'modifier-module',
      component: ModifierModule,
    },
    {
      path: '/inscription',
      name: 'gestion-inscription',
      component: ListeInscription,
    },
    {
      path: '/inscription/ajouter',
      name: 'ajout-inscription',
      component: AjouterInscription,
    },
    {
      path: '/inscription/modifier/:id',
      name: 'modifier-inscription',
      component: ModifierInscription,
    },
    {
      path: '/payment',
      children: [
        {
          path: '',
          component:ListPayments,
          name: 'payments'
        },
        {
          path: 'new',
          component:AddPayment,
          name: 'add-payment'
        },
      ]

    }
  ],
})

export default router
