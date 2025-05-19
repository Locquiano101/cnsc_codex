import { Route, Routes, Outlet, Navigate, Link } from "react-router-dom";
import React, { useEffect } from "react";
import "./main.css";
import LoginPage from "./pages/public/landing_page/login";
import RegisterPage from "./pages/public/landing_page/register";
import AdviserAdminPage from "./pages/admin/adviser/app_adviser";
import StudentLeaderPage from "./pages/admin/student_leader/app_student_leader";
import StudentDevelopmentUnitPage from "./pages/admin/SDU/app_SDU";
import NewsFeedPage from "./pages/public/newsfeed_page/app_main";
import OrganizationProfilePage from "./pages/public/organization_page/organization_profile";
import OrganizationPage from "./pages/public/organization_page/organizations";
import DeanAdminPage from "./pages/admin/dean/app_dean";
import OSSDCoordinatorPage from "./pages/admin/ossd_coordinator/app_ossd_coordinator";

<<<<<<< HEAD
export const API_ROUTER = "http://192.168.1.16:8080/api";

=======
export const API_ROUTER = "http://localhost:8080/api";
>>>>>>> f2a84fc1a5a5c431120669e8f4367310c25fb0fc
// Updated ProtectedRoute with allowedRoles prop
const ProtectedRoute = ({ allowedRoles }) => {
  // Retrieve token and user position from localStorage
  const token = localStorage.getItem("token");
  const storedRole = localStorage.getItem("position");

  // If no token found, user is not authenticated.
  if (!token) {
    return <Navigate to="/Unauthorized" />;
  }

  // Check if a role is required and if so whether the stored role matches.
  if (allowedRoles && !allowedRoles.includes(storedRole)) {
    return <Navigate to="/Unauthorized" />;
  }

  // User is authenticated and has one of the allowed roles.
  return <Outlet />;
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
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/NewsFeed" element={<NewsFeedPage />} />
      <Route path="/organization" element={<OrganizationPage />} />
      <Route
        path="/organization/profile/:orgName"
        element={<OrganizationProfilePage />}
      />

      {/* Protected routes per user role */}
      <Route element={<ProtectedRoute allowedRoles={["adviser"]} />}>
        <Route path="/admin/adviser" element={<AdviserAdminPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["dean"]} />}>
        <Route path="/admin/dean" element={<DeanAdminPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["ossd coordinator"]} />}>
        <Route
          path="/admin/ossdCoordinator"
          element={<OSSDCoordinatorPage />}
        />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["student-leader"]} />}>
        <Route path="/admin/student-leader" element={<StudentLeaderPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["sdu"]} />}>
        <Route
          path="/admin/student-development-unit"
          element={<StudentDevelopmentUnitPage />}
        />
      </Route>

      {/* Unauthorized and Page Not Found */}
      <Route path="/Unauthorized" element={<UnauthorizedAccess />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
