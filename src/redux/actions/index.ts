export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = (data: any) => ({
  type: LOGIN,
  payload: data,
});

export const logout = () => ({
  type: LOGOUT,
});
