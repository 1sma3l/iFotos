import useStore from "src/store";

const isAuthenticatedGuard = async (to, from, next) => {
  const store = useStore();
  //disparo la accion, para que ejecute el checkAuthentication
  const { success } = await store.dispatch("home/checkAuthentication");
  if (success) {
    next();
  } else {
    next({ name: "LoginPage" });
  }
};
export default isAuthenticatedGuard;
