import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/login', component: () => import('pages/Auth/LoginPage.vue') },
      // requiresAuth: el guard del router (router/index.ts) exige sesion iniciada
      { path: '/barberos', component: () => import('pages/Barber/BarberosPage.vue'), meta: { requiresAuth: true } },
      { path: '/citas', component: () => import('pages/Appointment/CitasPage.vue'), meta: { requiresAuth: true } },
      { path: '/clientes', component: () => import('pages/Client/ClientesPage.vue'), meta: { requiresAuth: true } },
      { path: '/pagos', component: () => import('pages/Payment/PagosPage.vue'), meta: { requiresAuth: true } },
      { path: '/productos', component: () => import('pages/Product/ProductosPage.vue'), meta: { requiresAuth: true } },
      { path: '/resenas', component: () => import('pages/Review/ResenasPage.vue'), meta: { requiresAuth: true } },
      { path: '/ventas', component: () => import('pages/Sale/VentasPage.vue'), meta: { requiresAuth: true } },
      { path: '/detalles-venta', component: () => import('pages/SaleDetail/DetallesVentaPage.vue'), meta: { requiresAuth: true } },
      { path: '/servicios', component: () => import('pages/Service/ServiciosPage.vue'), meta: { requiresAuth: true } },

    ],

    
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
