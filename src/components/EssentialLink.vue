<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      v-for="menu in menus"
      :key="menu"
      expand-separator
      :icon="menu.icon"
      :label="menu.title"
    >
      <q-item
        clickable
        v-for="items in menu.submenu"
        :key="items"
        @click="navigateTo(items.Ira)"
      >
        <q-item-section v-if="items.icon" avatar>
          <q-icon :name="items.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ items.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "EssentialLink",
  setup() {
    return {
      menus: ref([
        // {
        //   title: "Contenido",
        //   icon: "ballot",
        //   hidden: false,
        //   submenu: [
        //     { title: "Perfil", icon: "edit_note", Ira: "profiles" },
        //     { title: "Compañias", icon: "apartment", Ira: "profiles" },
        //     { title: "Empleados", icon: "reduce_capacity", Ira: "profiles" },
        //   ],
        // },
        // {
        //   title: "Ajustes",
        //   icon: "content_paste",
        //   hidden: false,
        //   submenu: [
        //     { title: "Perfil", icon: "edit_note", Ira: "profiles" },
        //     { title: "Compañias", icon: "apartment", Ira: "profiles" },
        //     { title: "Empleados", icon: "reduce_capacity", Ira: "profiles" },
        //   ],
        // },
        {
          title: "Administración",
          icon: "manage_accounts",
          hidden: false,
          submenu: [
            {
              title: "Usuarios",
              icon: "account_circle",
              Ira: "users",
            },
          ],
        },
      ]),
    };
  },
});
</script>
