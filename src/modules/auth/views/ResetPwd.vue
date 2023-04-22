<template>
  <div class="row" style="height: 90vh">
    <div class="col-0 col-md-6 flex justify-center content-center">
      <img src="~assets/forgot.svg" class="responsive" alt="login-image" />
    </div>
    <div
      v-bind:class="{
        'justify-center': $q.screen.md || $q.screen.sm || $q.screen.xs,
      }"
      class="col-12 col-md-6 flex content-center"
    >
      <q-card
        :style="(style = $q.screen.lt.sm ? { width: '80%' } : { width: '50%' })"
      >
        <q-card-section>
          <div class="q-pt-lg">
            <div class="col text-h6 ellipsis flex justify-center">
              <div class="text-h5 q-my-none text-weight-regular">
                Restablecer contraseña
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input
              class="q-mb-sm"
              filled
              v-model="userForm.email"
              label="Correo electronico *"
              type="email"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Correo obligatorio',
                (val) => isValidEmail(val),
              ]"
            />
            <div>
              <q-btn
                color="primary"
                class="full-width"
                label="Enviar"
                type="submit"
                rounded
              />
              <div class="text-center q-mt-sm q-gutter-lg">
                <router-link
                  class="text-black text-subtitle2"
                  :to="{ name: 'LoginPage' }"
                  >Ir al incio</router-link
                >
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import useAuth from "../composables/useAuth";
import { useQuasar } from "quasar";

export default {
  name: "ResetPwd",
  setup() {
    const { resetPwd } = useAuth();
    const $q = useQuasar();
    const router = useRouter();

    //controles reactivos del html
    const userForm = ref({
      email: "",
    });

    return {
      userForm,

      onSubmit: async () => {
        $q.loading.show({
          message: "Procesando información, Espere un momento por favor...",
        });
        //Llamo a la funcion loginUser, que esta en el composable
        const { success } = await resetPwd(userForm.value);
        $q.loading.hide();
        if (success) {
          $q.notify({
            message: "Solicitud enviada por correo electrónico",
            position: "bottom",
            type: "positive",
          });
          router.push({ name: "LoginPage" });
        } else {
          $q.notify({
            message: "Estamos teniendo incovenientes, intentelo nuevamente",
            icon: "report_problem",
            position: "bottom",
            type: "negative",
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

<style scoped></style>
