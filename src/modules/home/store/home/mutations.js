export const setDatauser = (state, { localId, displayName }) => {
  state.localId = localId;
  state.displayName = displayName;
};

export const logOut = (state) => {
  //Limpiamos el state del componente
  state.localId = null;
  state.displayName = "";

  //Limpiamos el localstorage del navegador
  localStorage.removeItem("tkn");
};
