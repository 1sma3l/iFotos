export const loginUser = (state, { accessToken }) => {
  if (accessToken) {
    localStorage.setItem("tkn", accessToken);
    state.idToken = accessToken;
  }
};
