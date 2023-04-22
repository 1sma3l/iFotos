import useStore from "src/store";

const isAuthenticatedGuard = async (to, from, next) => {
  debugger;
  const store = useStore();
  console.log(to, from);
  //disparo la accion, para que ejecute el checkAuthentication
  const { ok } = await store.dispatch("auth/checkAuthentication");
  if (ok) {
    next();
  } else {
    next({ name: "LoginPage" });
  }
};
export default isAuthenticatedGuard;
