import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";
import Layout from "../components/Layout";

const Unauthorized = () => {
  return (
    <Layout>
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ShieldX size={28} className="text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You do not have permission to access this page.
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-flex rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;
