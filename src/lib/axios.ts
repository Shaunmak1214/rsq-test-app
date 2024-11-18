import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:6543/v1/",
});

export default instance;
