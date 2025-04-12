import "./main.css";
import { useEffect } from "react";
import { Route, Routes, Outlet, Navigate, Link } from "react-router-dom";
import { StoreImage } from "./api/homepage_api";
import AdminSection from "./pages/admin/adviser/app_adviser";
import StudentAdminSection from "./pages/admin/student_leader/app_student_leader";
import LoginSection from "./pages/public/landing_page/login";
import StudentDevelopmentUnitSection from "./pages/admin/SDU/app_SDU";
import { LandingPage } from "./pages/public/landing_page/app_main";
import RegisterSection from "./pages/public/landing_page/register";
import Sandbox from "./sandbox";
import Register from "./sandbox2";
import RegisterSectionSandbox from "./sandbox2";
export const API_ROUTER = "http://localhost:8080/api";

const ProtectedRoute = () => {
  // Get token from localStorage
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/Unauthorized" />;
};

function PageNotFound() {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <h1 className="text-4xl font-bold">Error 404</h1>
      <p className="text-lg">Page not found</p>
      <Link
        to="/"
        className="bg-cnsc-primary-color px-24 py-4 text-white uppercase"
      >
        return to home page
      </Link>
    </div>
  );
}
function UnauthorizedAccess() {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <h1 className="text-4xl font-bold">Error 401</h1>
      <p className="text-lg">Unauthorized Access</p>
      <Link
        to="/"
        className="bg-cnsc-primary-color px-24 py-4 text-white uppercase"
      >
        return to home page
      </Link>
    </div>
  );
}
export default function App() {
  useEffect(() => {
    StoreImage();
  }, []); // The effect will run after every render if count changes

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterSection />} />
      <Route path="/sandbox" element={<Sandbox />} />
      <Route path="/random" element={<RegisterSectionSandbox />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/adviser" element={<AdminSection />} />
        <Route path="/admin/student-leader" element={<StudentAdminSection />} />
        <Route
          path="/admin/student-development-unit"
          element={<StudentDevelopmentUnitSection />}
        />
      </Route>
      <Route path="/*" element={<PageNotFound />} />
      <Route path="/Unauthorized" element={<UnauthorizedAccess />} />
    </Routes>
  );
}
