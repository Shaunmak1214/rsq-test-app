import cookie from "js-cookie";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

const initialState = {
  user: cookie.get("user") !== undefined ? JSON.parse(cookie.get("user")) : {},
  isAuthenticated: cookie.get("accessToken") ? true : false,
  accessToken: cookie.get("accessToken") ? cookie.get("accessToken") : "",
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
      cookie.set("accessToken", action.payload.accessToken);
      cookie.set("user", JSON.stringify(action.payload));
      cookie.set("isAuthenticated", JSON.stringify(true));
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        user: action.payload,
      };

    case LOGOUT:
      cookie.remove("accessToken");
      cookie.remove("user");
      cookie.remove("isAuthenticated");
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        user: null,
      };

    default:
      return state;
  }
}
