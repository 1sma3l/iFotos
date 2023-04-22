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
        @click="navigateTo(items.ira)"
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
import { useRouter } from "vue-router";

export default defineComponent({
  name: "EssentialLink",

  setup() {
    const router = useRouter();

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
              ira: "newUser",
            },
          ],
        },
      ]),

      navigateTo(nameComponent) {
        //Abro el componente del visor de pdf, en una nueva pestaña, para que no se muestre el dashboard de la aplicacion
        //Abrir el componente en pestaña independiente
        if (nameComponent.startsWith("pdfViewer")) {
          let routerUrl = router.resolve({
            name: "pdfViewer",
            query: { uuid: "A938BF06-87AC-47EB-BA9C-D6384231F508" },
          });
          window.open(routerUrl.href, "_blank");
        } else if (nameComponent.startsWith("http")) {
          //Abrir URL de pagina externa en pestaña independiente
          window.open(nameComponent, "_blank");
        } else {
          //Abrir componente de Vue, dentro del RouterView
          router.push({ name: nameComponent });
        }
      },
    };
  },
});
</script>
