<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="{ 'fondo-bloqueado': !auth.isAuthenticated }">
      <q-toolbar>
        <q-btn
          v-if="auth.isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Agendify
        </q-toolbar-title>

        <template v-if="auth.isAuthenticated">
          <q-icon name="person" class="q-mr-xs" />
          <span class="q-mr-md">{{ auth.userName }}</span>
          <q-btn flat dense label="Salir" icon="logout" @click="onLogout" />
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="auth.isAuthenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container :class="{ 'fondo-bloqueado': !auth.isAuthenticated }">
      <router-view />
    </q-page-container>

    <LoginModal />
  </q-layout>
</template>

<style scoped>
.fondo-bloqueado {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import LoginModal from 'components/Auth/LoginModal.vue';
import { useAuthStore } from 'stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  auth.logout();
  await router.push('/');
}

const linksList: EssentialLinkProps[] = [
  { title: 'Barberos', caption: 'Listado de barberos', icon: 'content_cut', link: '/barberos' },
  { title: 'Citas', caption: 'Listado de citas', icon: 'event', link: '/citas' },
  { title: 'Clientes', caption: 'Listado de clientes', icon: 'people', link: '/clientes' },
  { title: 'Servicios', caption: 'Listado de servicios', icon: 'build', link: '/servicios' },
  { title: 'Productos', caption: 'Listado de productos', icon: 'inventory_2', link: '/productos' },
  { title: 'Ventas', caption: 'Listado de ventas', icon: 'point_of_sale', link: '/ventas' },
  { title: 'Detalles de venta', caption: 'Detalle de cada venta', icon: 'receipt_long', link: '/detalles-venta' },
  { title: 'Pagos', caption: 'Listado de pagos', icon: 'payments', link: '/pagos' },
  { title: 'Reseñas', caption: 'Listado de reseñas', icon: 'star', link: '/resenas' },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>