// utils/auth.jsx

export const saveAuth = (data) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("user", JSON.stringify(data.user));
};

export const logout = () => {
    sessionStorage.clear();
};

export const getToken = () => sessionStorage.getItem("token");

export const getRole = () => sessionStorage.getItem("role");

export const getUser = () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
};
