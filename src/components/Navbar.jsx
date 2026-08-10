import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Users, LogOut } from "lucide-react";

import supabase from "../services/supabase";
import { getProfile } from "../services/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadRole = async () => {
      try {
        const { data } = await getProfile();
        setRole(data.profile?.role || "");
      } catch {
        setRole("");
      }
    };

    loadRole();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  const linkClass = (path) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-0">
        <Link
          to={role === "admin" ? "/admin" : "/profile"}
          className="text-2xl font-bold text-slate-900"
        >
          Profile Management
        </Link>

        <nav className="flex items-center gap-1">
          {/* Dashboard - Admin Only */}
          {role === "admin" && (
            <Link to="/admin" className={linkClass("/admin")}>
              <LayoutDashboard size={17} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* Profile */}
          <Link to="/profile" className={linkClass("/profile")}>
            <User size={17} />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          {/* Users - Admin Only */}
          {role === "admin" && (
            <Link to="/admin/users" className={linkClass("/admin/users")}>
              <Users size={17} />
              <span className="hidden sm:inline">Users</span>
            </Link>
          )}

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="ml-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
