import axios from "axios";
const API_BASE_URL = import.meta.env.API_BASE_URL;

export async function loginAdmin(email: string, password: string) {
    const res = await axios.post(`${API_BASE_URL}/v1/auth/login`, { email, password });
    // Store token if returned in response
    const token = res.data?.data?.token || res.data?.token;
    if (token) {
        sessionStorage.setItem("token", token);
    }

    return res.data;
}

export function logout() {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem("token"));
}
