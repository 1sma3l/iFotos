import authApi from "src/api/authApi";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const checkAuthentication = async ({ commit }) => {
  try {
    let accessToken = localStorage.getItem("tkn");
    const db = getFirestore();
    if (!accessToken) {
      commit("logOut");
      return { success: false };
    }
    const { data } = await authApi.post(":lookup", { idToken: accessToken });
    let { localId, displayName } = data.users[0];
    const docRef = doc(db, "usuarios", `${localId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      displayName = docSnap.data().name;
    }
    commit("setDatauser", { localId, displayName }); //Llamo la mutacion
    return { success: true };
  } catch (Ex) {
    console.log("checkAuthentication " + Ex.message);
    commit("logOut");
    return { success: false };
  }
};

export const signInOut = async ({ commit }) => {
  try {
    const auth = getAuth();
    signOut(auth);
    commit("logOut");
    return { success: true };
  } catch (Ex) {
    console.log("signInOut " + Ex.message);
    commit("logOut");
    return { success: false };
  }
};
