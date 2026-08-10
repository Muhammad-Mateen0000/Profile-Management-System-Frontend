import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const Dashboard = Profile;

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="/admin/users" element={<Users />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
