import supabase from "./supabase";

const API_URL = import.meta.env.VITE_API_URL;

const request = async (url, options = {}) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

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

  const data = await response.json();

  if (!response.ok) {
    throw {
      response: {
        status: response.status,
        data,
      },
    };
  }

  return { data };
};

export const getProfile = () => request("/profile");

export const updateProfile = (payload) =>
  request("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return request("/profile/avatar", {
    method: "POST",
    body: formData,
  });
};

export const deleteProfileImage = () =>
  request("/profile/avatar", {
    method: "DELETE",
  });

export const createUser = (payload) =>
  request("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getUsers = (search = "") =>
  request(
    `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`,
  );

export const getUser = (id) => request(`/admin/users/${id}`);

export const updateUser = (id, payload) =>
  request(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const updateUserRole = (id, role) =>
  request(`/admin/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const updateUserStatus = (id, status) =>
  request(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteUser = (id) =>
  request(`/admin/users/${id}`, {
    method: "DELETE",
  });
