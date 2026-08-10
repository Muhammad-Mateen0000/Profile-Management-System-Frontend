import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Save,
  User,
  X,
  Upload,
} from "lucide-react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} from "../services/api";

const Profile = () => {
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();
      const data = response.data.profile;

      if (!data) {
        setError("Profile not found.");
        return;
      }

      setProfile(data);

      setForm({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        bio: data.bio || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const firstName = form.first_name.trim();
    const lastName = form.last_name.trim();

    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      return;
    }

    if (firstName.length < 3 || lastName.length < 3) {
      setError("Full name must contain at least 3 characters.");
      return;
    }

    const fullName = `${firstName} ${lastName}`;

    if (fullName.length > 50) {
      setError("Full name must not exceed 50 characters.");
      return;
    }

    if (form.first_name !== firstName || form.last_name !== lastName) {
      setError(
        "First name and last name must not have leading or trailing spaces.",
      );
      return;
    }

    if (form.phone && !/^[0-9+\-().\s]+$/.test(form.phone)) {
      setError("Phone number contains invalid characters.");
      return;
    }

    if (form.phone.length > 20) {
      setError("Phone number must not exceed 20 characters.");
      return;
    }

    if (form.bio.length > 250) {
      setError("Bio must not exceed 250 characters.");
      return;
    }

    try {
      setSaving(true);

      const response = await updateProfile(form);

      setProfile(response.data.profile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const selectImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG and PNG images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setPreview(previewUrl);
    setSelectedFile(file);
  };

  const cancelImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview("");
    setSelectedFile(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const response = await uploadProfileImage(selectedFile);

      setProfile(response.data.profile);
      setMessage("Profile image updated successfully.");

      cancelImage();
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      setUploading(true);
      setError("");
      setMessage("");

      await deleteProfileImage();

      setProfile((prev) => ({
        ...prev,
        avatar_url: null,
      }));

      setMessage("Profile image removed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to remove profile image.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <User size={40} className="mx-auto text-slate-400" />

          <h2 className="mt-4 font-semibold text-slate-900">
            Profile not found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your profile information could not be loaded.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-2xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and profile picture.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Image */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                {preview || profile.avatar_url ? (
                  <img
                    src={preview || profile.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={52} className="text-slate-400" />
                )}
              </div>

              <h2 className="mt-4 font-semibold text-slate-900">
                {profile.first_name} {profile.last_name}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {profile.email}
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={selectImage}
                className="hidden"
              />

              {!selectedFile ? (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <Camera size={17} />
                  Change Photo
                </button>
              ) : (
                <div className="mt-5 w-full space-y-2">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={uploadImage}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    <Upload size={17} />
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </button>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={cancelImage}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              )}

              {profile.avatar_url && !selectedFile && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={removeImage}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={17} />
                  Remove Photo
                </button>
              )}

              <p className="mt-3 text-xs text-slate-400">
                JPG, JPEG or PNG · Maximum 2 MB
              </p>
            </div>
          </section>

          {/* Profile Information */}
          <form
            onSubmit={saveProfile}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              Personal Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  First Name
                </label>

                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  maxLength={50}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Last Name
                </label>

                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  maxLength={50}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Mail size={16} />
                  Email Address
                </label>

                <input
                  value={profile.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Phone size={16} />
                  Phone Number
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="+923001234567"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="mb-2 flex justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Bio / About
                  </label>

                  <span className="text-xs text-slate-400">
                    {form.bio.length}/250
                  </span>
                </div>

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  maxLength={250}
                  rows={5}
                  placeholder="Tell something about yourself..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                <p className="flex items-center gap-1">
                  <Calendar size={13} />
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>

                <p className="mt-1">
                  Updated: {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
