import { ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";

const useHome = () => {
  const $q = useQuasar();
  const store = useStore();
  const listUsers = ref([]);

  const checkSession = async () => {
    //Ejecuto accion para veririficar la session
    await store.dispatch("home/checkAuthentication");
  };

  const logout = async () => {
    const resp = await store.dispatch("home/signInOut"); //Ejecuto accion para salir y eliminar credenciales de acceso
    return resp;

    //Ejecuto la mutacion
    //store.commit("auth/logOut"); //Se ejecuta el logout
  };

  return {
    logout,
    checkSession,
  };
};

export default useHome;
