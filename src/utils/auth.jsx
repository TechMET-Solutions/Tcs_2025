export const saveAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user", JSON.stringify(data.user));
};

export const logout = () => {
    localStorage.clear();
};

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
