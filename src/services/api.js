
import supabase from "./supabase";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

const request = async (url, options = {}) => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured.");
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw {
      response: {
        status: response.status,
        data:
          typeof data === "string"
            ? { message: data || "Request failed" }
            : data,
      },
    };
  }

  return { data };
};

// Profile APIs
export const getProfile = () => request("/api/profile");

export const updateProfile = (payload) =>
  request("/api/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return request("/api/profile/avatar", {
    method: "POST",
    body: formData,
  });
};

export const deleteProfileImage = () =>
  request("/api/profile/avatar", {
    method: "DELETE",
  });

// Admin user APIs
export const createUser = (payload) =>
  request("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getUsers = (search = "") =>
  request(
    `/api/admin/users${
      search ? `?search=${encodeURIComponent(search)}` : ""
    }`,
  );

export const getUser = (id) =>
  request(`/api/admin/users/${encodeURIComponent(id)}`);

export const updateUser = (id, payload) =>
  request(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const updateUserRole = (id, role) =>
  request(`/api/admin/users/${encodeURIComponent(id)}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const updateUserStatus = (id, status) =>
  request(`/api/admin/users/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteUser = (id) =>
  request(`/api/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
