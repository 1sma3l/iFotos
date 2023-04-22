<template>
  <div class="q-pa-md">
    <q-table
      dense
      title="Usuarios"
      :rows="listUsers"
      :columns="columns"
      :visible-columns="visibleColumns"
      row-key="name"
      rows-per-page-label="Registros por pagina:"
      no-results-label="Sin resultados de búsqueda"
      no-data-label="No hay datos"
      :filter="filter"
      :rows-per-page-options="[10, 20, 30, 0]"
      :pagination-label="
        (firstRowIndex, endRowIndex, totalRowsNumber) => {
          return `${endRowIndex} de ${totalRowsNumber}`;
        }
      "
    >
      <template v-slot:top>
        <span class="text-h6 q-pa-sm">Usuarios</span>
        <div class="q-pa-sm">
          <q-btn
            @click="newRow"
            class="glossy"
            round
            color="primary"
            icon="post_add"
            :ripple="{ color: 'white' }"
          >
            <q-tooltip class="bg-primary">Nuevo</q-tooltip>
          </q-btn>
        </div>
        <q-space />
        <q-input
          debounce="300"
          v-model="filter"
          placeholder="Buscar"
          style="width: 200px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="q-mx-xs"
            icon="edit"
            color="positive"
            dense
            size="sm"
            @click="editRow(props.row)"
          >
          </q-btn>
          <!-- <q-btn
            class="q-mx-xs"
            icon="delete"
            color="negative"
            dense
            size="sm"
            @click="deleteRow(props.row.id)"
          >
          </q-btn> -->
        </q-td>
      </template>
    </q-table>

    <!-- notice dialogRef here -->
    <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <div class="text-h5 q-my-none text-weight-regular">Usuarios</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              filled
              required
              v-model="registerForm.name"
              label="Nombre *"
              hint="Nombre y apellido"
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            />
            <q-select
              filled
              v-model="registerForm.rol"
              :options="listRoles"
              lazy-rules
              label="Rol *"
              emit-value
              map-options
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'No ha seleccionado una opción',
              ]"
            />
            <q-input
              class="q-mb-sm"
              filled
              v-model="registerForm.email"
              label="Correo electronico *"
              type="email"
              lazy-rules
              :disable="!isNewRow"
              :rules="[
                (val) => (val && val.length > 0) || 'Correo obligatorio',
                (val) => isValidEmail(val),
              ]"
            />
            <q-input
              v-if="isNewRow"
              class="q-mb-sm"
              filled
              v-model="registerForm.password"
              label="Contraseña *"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') || 'Contraseña obligatoria',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <q-input
              v-model="registerForm.telefono"
              filled
              type="tel"
              label="Número telefonico"
              maxlength="10"
            />
            <q-toggle
              v-model="registerForm.activo"
              label="Activo"
              color="primary"
              keep-color
            />
            <!-- buttons example -->
            <q-card-actions align="right">
              <q-btn color="secondary" style="width: 90px" v-close-popup=""
                >Cancelar</q-btn
              >
              <q-btn
                color="primary"
                style="width: 90px"
                label="Guardar"
                type="submit"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
const columns = [
  {
    name: "id",
    label: "Identificador unico",
    align: "left",
    field: (row) => row.id,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "Nombre",
    field: "name",
    sortable: true,
  },
  { name: "email", label: "Correo", field: "email", align: "left" },
  { name: "rol", label: "Rol", field: "rol", align: "center" },
  { name: "creado", label: "Creado por", field: "creado", align: "center" },
  {
    name: "fecha_creado",
    label: "Fecha creación",
    align: "left",
    field: (row) => row.fecha_creado,
  },
  {
    name: "modificado",
    label: "Modificado por",
    field: "modificado",
    align: "center",
  },
  {
    name: "fecha_modificado",
    label: "Fecha de modificación",
    align: "left",
    field: (row) => row.fecha_modificado,
  },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "activo", label: "Estatus", field: "activo" },
  { name: "actions", label: "Acciones", field: "actions", align: "center" },
];

const visibleColumns = [
  "name",
  "email",
  "rol",
  "creado",
  "fecha_creado",
  "modificado",
  "fecha_modificado",
  "telefono",
  "activo",
  "actions",
];

import { ref } from "vue";
import useRegister from "../composables/useRegister";
import { useQuasar, useDialogPluginComponent } from "quasar";

export default {
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    const $q = useQuasar();
    const { loadUsers, listUsers, listRoles, saveUser, deleteUser } =
      useRegister();

    loadUsers();

    const isNewRow = ref(true);
    //controles reactivos de registrar usuarios
    const registerForm = ref({
      id: "",
      name: "",
      rol: null,
      email: "",
      emailbkp: "",
      password: "",
      activo: true,
      telefono: "",
      modoNav: "",
    });

    const clsCtrls = () => {
      registerForm.value.name = "";
      registerForm.value.rol = null;
      registerForm.value.email = "";
      registerForm.value.emailbkp = "";
      registerForm.value.password = "";
      registerForm.value.activo = true;
      registerForm.value.telefono = "";
      registerForm.value.modoNav = "";
      registerForm.value.id = "";
    };

    //Nuevo registro
    const newRow = () => {
      clsCtrls();
      isNewRow.value = true;
      registerForm.value.modoNav = "I";
      dialogRef.value.show();
    };

    //Borrar registro
    const deleteRow = (uid) => {
      $q.dialog({
        title: "Eliminar",
        message: "¿La información se elimnara permanentemente?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        console.log(uid);
        $q.loading.show({
          message: "Procesando información, Espere un momento por favor...",
        });
        const { success } = await deleteUser(uid);
        $q.loading.hide();
        if (success) {
          $q.notify({
            position: "bottom",
            type: "positive",
            message: "Usuario eliminado exitosamente",
          });
          loadUsers();
        }
      });
    };

    //Editar registro
    const editRow = (row) => {
      isNewRow.value = false;
      registerForm.value.modoNav = "E";
      registerForm.value.id = row.id;
      registerForm.value.name = row.name;
      registerForm.value.rol = row.rol;
      registerForm.value.email = row.email;
      registerForm.value.emailbkp = row.email;
      registerForm.value.activo = row.activo;
      registerForm.value.telefono = row.telefono;
      dialogRef.value.show();
    };

    return {
      visibleColumns,
      loadUsers,
      columns,
      listUsers,
      filter: ref(""),

      //Dialogo registrar usuarios
      dialogRef,
      onDialogHide,

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,

      //Funciones de registrar usuarios
      listRoles,
      clsCtrls,
      newRow,
      deleteRow,
      editRow,
      registerForm,
      isPwd: ref(true),
      isNewRow,
      onSubmit: async () => {
        $q.loading.show({
          message: "Procesando información, Espere un momento por favor...",
        });
        onDialogOK();
        //Llamo a la funcion loginUser, que esta en el composable
        const { success } = await saveUser(registerForm.value);
        $q.loading.hide();
        if (success) {
          if (registerForm.value.modoNav == "I") {
            $q.notify({
              position: "bottom",
              type: "positive",
              message:
                "Usuario registrado, se ha enviado un correo de notificación",
            });
          }
          loadUsers();
        } else {
          $q.notify({
            icon: "report_problem",
            position: "bottom",
            type: "negative",
            message: "Error al registrar usuario, intente nuevamente",
          });
        }
      },
      isValidEmail(val) {
        const emailPattern =
          /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return (
          emailPattern.test(val) ||
          "El correo electronico contiene un formato no válido"
        );
      },
    };
  },
};
</script>
