import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import Loader from "./Loader";

const AdminRoute = () => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await getProfile();

        setAllowed(response.data.profile?.role === "admin");
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return allowed ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
