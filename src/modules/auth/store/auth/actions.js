import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
//import authApi from "src/api/authApi";

export const signInUser = async ({ commit }, user) => {
  try {
    const { email, password } = user;
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { accessToken, emailVerified } = userCredential.user;
    if (emailVerified) {
      //Ejecuto mutacion par que impacte al store
      commit("loginUser", { accessToken });
      return { success: true };
    } else {
      return { success: false, message: "Usuario sin correo verificado" };
    }
  } catch (Ex) {
    console.log("Login: " + Ex.message);
    if (Ex.message == "Firebase: Error (auth/user-disabled).") {
      return { success: false, message: "Usuario deshabilitado" };
    } else {
      return { success: false };
    }
  }
};

export const resetPwd = async ({ commit }, data) => {
  try {
    const { email } = data;
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    // const { data } = await authApi.post(":sendOobCode", {
    //   requestType: "PASSWORD_RESET",
    //   email,
    // });
    return { success: true };
  } catch (Ex) {
    console.log("ResetPwd: " + Ex.message);
    return { success: false };
  }
};

// export const signInOut = async ({ commit }) => {
//   try {
//     const auth = getAuth();
//     signOut(auth);
//     commit("logOut");
//     return { success: true };
//   } catch (Ex) {
//     console.log("signInOut " + Ex.message);
//     commit("logOut");
//     return { success: false };
//   }
// };
