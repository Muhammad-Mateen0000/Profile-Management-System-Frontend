import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, UserRound } from "lucide-react";

import Layout from "../components/Layout";
import Loader from "../components/Loader";

import {
  createUser,
  getUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} from "../services/api";

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const loadUsers = async (value = search) => {
    try {
      setLoading(true);

      const { data } = await getUsers(value);

      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    loadUsers(value);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setMessage("");
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditing(user);

    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role || "user",
    });

    setMessage("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setMessage("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim()
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (!editing && form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        await updateUser(editing.id, {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
        });

        if (editing.role !== form.role) {
          await updateUserRole(editing.id, form.role);
        }

        setMessage("User updated successfully.");
      } else {
        await createUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        });

        setMessage("User created successfully.");
      }

      await loadUsers();

      // Close popup after successful create/update
      setShowForm(false);
      setForm(emptyForm);
      setEditing(null);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      await loadUsers();
    } catch {
      setMessage("Failed to update role.");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      await loadUsers();
    } catch {
      setMessage("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Users Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered users.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={17} />
            Add User
          </button>
        </div>

        {message && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            {message}
          </div>
        )}

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
          />
        </div>

        {loading ? (
          <Loader text="Loading users..." />
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <UserRound size={32} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt=""
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                              <UserRound size={18} />
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-slate-900">
                              {user.first_name} {user.last_name}
                            </p>

                            <p className="text-sm text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.phone || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRole(user.id, e.target.value)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium outline-none"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.status}
                          onChange={(e) =>
                            handleStatus(user.id, e.target.value)
                          }
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium outline-none"
                        >
                          <option value="active">Active</option>

                          <option value="inactive">Inactive</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {editing ? "Edit User" : "Add User"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {editing
                      ? "Update user information."
                      : "Create a new user account."}
                  </p>
                </div>

                <button
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />

                  <Field
                    label="Last Name"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!editing}
                  required
                />

                <Field
                  label="Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                {!editing && (
                  <Field
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Role
                  </label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editing
                        ? "Update User"
                        : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = false,
}) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
    />
  </div>
);

export default Users;
