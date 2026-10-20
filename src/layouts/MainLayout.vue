<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
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

        <!-- Con sesion: nombre de usuario y boton para salir. Sin sesion: boton para ingresar -->
        <template v-if="auth.isAuthenticated">
          <q-icon name="person" class="q-mr-xs" />
          <span class="q-mr-md">{{ auth.userName }}</span>
          <q-btn flat dense label="Salir" icon="logout" @click="onLogout" />
        </template>
        <q-btn v-else flat dense label="Ingresar" icon="login" to="/login" />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuthStore } from 'stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  auth.logout();
  await router.push('/login');
}

const linksList: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  },
  {
    title: 'Barberos',
    caption: 'Listado de barberos',
    icon: 'content_cut',
    link: '/barberos'
  }
  

  ,{
    title: 'Citas',
    caption: 'Listado de citas',
    icon: 'event',
    link: '/citas'
  },
  {
    title: 'Clientes',
    caption: 'Listado de clientes',
    icon: 'people',
    link: '/clientes'
  },
  {
    title: 'Pagos',
    caption: 'Listado de pagos',
    icon: 'payments',
    link: '/pagos'
  },
  {
    title: 'Productos',
    caption: 'Listado de productos',
    icon: 'inventory_2',
    link: '/productos'
  },
  {
    title: 'Resenas',
    caption: 'Listado de resenas',
    icon: 'star',
    link: '/resenas'
  },
  {
    title: 'Ventas',
    caption: 'Listado de ventas',
    icon: 'point_of_sale',
    link: '/ventas'
  },
  {
    title: 'Detalles de venta',
    caption: 'Listado de detalles de venta',
    icon: 'receipt_long',
    link: '/detalles-venta'
  },
  {
    title: 'Servicios',
    caption: 'Listado de servicios',
    icon: 'content_cut',
    link: '/servicios'
  },

];


const leftDrawerOpen = ref(false);

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
