import axios from "axios";

const authApi = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/accounts",
  params: {
    key: "AIzaSyDlX1lJViYzmBQ3PeL-vNMdqJeAzLs18cg",
  },
});

export default authApi;
