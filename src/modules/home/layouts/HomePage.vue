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

        <q-toolbar-title> iFotos </q-toolbar-title>

        <div>
          <span class="text-subtitle2 q-pa-md">{{ username }}</span>
          <q-btn @click="onLogOut" outline style="color: brown-5" icon="logout">
            <q-tooltip class="bg-primary">Cerrar sesion</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menú principal </q-item-label>
        <EssentialLink />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useAuth from "../../auth/composables/useAuth";
import EssentialLink from "src/modules/home/components/EssentialLink.vue";
import { useQuasar } from "quasar";
import useHome from "../composables/useHome";

export default defineComponent({
  name: "HomePage",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const $q = useQuasar();
    const store = useStore();
    const { checkSession, logout } = useHome();

    checkSession();

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      onLogOut: async () => {
        $q.loading.show({
          message: "Procesando información, Espere un momento por favor...",
        });
        //Llamo a la funcion loginUser, que esta en el composable
        const { success } = await logout();
        $q.loading.hide();
        if (success) {
          $q.notify({
            message: "Sessión terminada",
            position: "bottom",
            type: "positive",
          });
        }
        router.push({ name: "LoginPage" });
        //logout();
      },

      username: computed(() => store.getters["home/displayName"]),
    };
  },
});
</script>
