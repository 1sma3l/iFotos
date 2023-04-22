import {
  getFirestore,
  collection,
  getDocs,
  Timestamp,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import authApi from "src/api/authApi";

export const getUsers = async ({ commit }) => {
  try {
    const db = getFirestore();
    let arrUser = [];
    const respUsers = await getDocs(collection(db, "usuarios"));
    respUsers.forEach((doc) => {
      let create = doc.data().fecha_creado;
      var dateC = new Date(create.seconds * 1000 + create.nanoseconds / 1000);
      let f_creado =
        dateC.getDate() +
        "/" +
        (dateC.getMonth() + 1) +
        "/" +
        dateC.getFullYear() +
        " " +
        dateC.getHours() +
        ":" +
        dateC.getMinutes();

      let modif = doc.data().fecha_modificado;
      let f_modif = "";
      if (modif != "") {
        var dateM = new Date(modif.seconds * 1000 + modif.nanoseconds / 1000);
        f_modif =
          dateM.getDate() +
          "/" +
          (dateM.getMonth() + 1) +
          "/" +
          dateM.getFullYear() +
          " " +
          dateM.getHours() +
          ":" +
          dateM.getMinutes();
      }
      let users = {
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        rol: doc.data().rol,
        creado: doc.data().creado,
        fecha_creado: f_creado,
        modificado: doc.data().modificado,
        fecha_modificado: f_modif,
        telefono: doc.data().telefono,
        activo: doc.data().activo,
      };
      arrUser.push(users);
    });
    return { success: true, arrUser: arrUser };
  } catch (Ex) {
    console.log("getUsers: " + Ex.message);
    return { success: false };
  }
};

export const getRoles = async ({ commit }) => {
  try {
    const db = getFirestore();
    let arrRoles = [];
    const respRol = await getDocs(collection(db, "roles"));
    respRol.forEach((doc) => {
      arrRoles.push({ value: doc.id, label: doc.data().name });
    });
    return { success: true, arrRoles: arrRoles };
  } catch (Ex) {
    console.log("getRoles: " + Ex.message);
    return { success: false };
  }
};

export const saveUser = async ({ commit }, user) => {
  try {
    const { name, rol, email, password, telefono, activo } = user;
    const auth = getAuth();
    const db = getFirestore();

    const userAuth = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userAuth.user.uid != null) {
      await updateProfile(userAuth.user, {
        displayName: name,
      });

      let accessToken = localStorage.getItem("tkn");
      if (!accessToken) {
        commit("logOut");
        return { success: false };
      }
      const { data } = await authApi.post(":lookup", { idToken: accessToken });
      const { displayName } = data.users[0];

      await setDoc(doc(db, "usuarios", userAuth.user.uid), {
        activo: activo,
        creado: displayName,
        fecha_creado: serverTimestamp(),
        email: email,
        name: name,
        rol: rol,
        telefono: telefono,
        fecha_modificado: "",
        modificado: "",
      });

      await sendEmailVerification(auth.currentUser);
    }
    return { success: true };
  } catch (Ex) {
    console.log("RegisterUser: " + Ex.message);
    return { success: false };
  }
};

export const editUser = async ({ commit }, user) => {
  try {
    const { id, name, rol, telefono, activo } = user;
    const auth = getAuth();
    const db = getFirestore();

    let accessToken = localStorage.getItem("tkn");
    if (!accessToken) {
      commit("logOut");
      return { success: false };
    }
    const { data } = await authApi.post(":lookup", { idToken: accessToken });
    const { displayName } = data.users[0];

    await updateDoc(doc(db, "usuarios", id), {
      activo: activo,
      modificado: displayName,
      fecha_modificado: serverTimestamp(),
      name: name,
      rol: rol,
      telefono: telefono,
    });
    return { success: true };
  } catch (Ex) {
    console.log("editUser: " + Ex.message);
    return { success: false };
  }
};

export const deleteUser = async ({ commit }, uid) => {
  try {
    debugger;
    getAuth().getUser(uid);
    return { success: true };
  } catch (Ex) {
    console.log("deleteUser: " + Ex.message);
    return { success: false };
  }
};
