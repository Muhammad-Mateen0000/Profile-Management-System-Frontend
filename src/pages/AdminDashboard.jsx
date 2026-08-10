import { useEffect, useState } from "react";
import { Users, UserCheck, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { getUsers } from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await getUsers();
        setUsers(data.users || []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const admins = users.filter((user) => user.role === "admin").length;

  const active = users.filter((user) => user.status === "active").length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-2xl">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage users and monitor account information.
            </p>
          </div>

          <Link
            to="/admin/users"
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Users size={17} />
            Manage Users
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading dashboard..." />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard icon={Users} title="Total Users" value={users.length} />

              <StatCard icon={UserCheck} title="Active Users" value={active} />

              <StatCard
                icon={ShieldCheck}
                title="Administrators"
                value={admins}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <UserRound size={19} className="text-slate-700" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900 text-2xl">
                    User Management
                  </h2>

                  <p className="text-sm text-slate-500">
                    View, search, edit and manage registered users.
                  </p>
                </div>
              </div>

              <Link
                to="/admin/users"
                className="mt-5 inline-block text-sm font-medium text-slate-900 hover:underline"
              >
                Open Users Management →
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
      <Icon size={19} className="text-slate-700" />
    </div>

    <p className="mt-5 text-sm text-slate-500">{title}</p>

    <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
  </div>
);

export default AdminDashboard;
