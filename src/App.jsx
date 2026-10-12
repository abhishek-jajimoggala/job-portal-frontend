
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles/Global.css";
import "./styles/Navbar.css";
import "./styles/Hero.css";
import "./styles/Responsive.css";
import "./styles/Login.css";
import "./styles/Profile.css";
import "./styles/Jobs.css";
import "./styles/Companies.css";
import "./styles/Applications.css";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import Categories from "./pages/Categories";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import JobListings from "./pages/JobListings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerify from "./pages/OTPVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import ManageJobs from "./pages/ManageJobs";
import AdminApplications from "./pages/AdminApplications";
import UserProfiles from "./pages/UserProfiles";
import PostedJobs from "./pages/PostedJobs";
import ShortlistedCandidates from "./pages/ShortlistedCandidates";
import RejectedCandidates from "./pages/RejectedCandidates";


function App() {

  const location = useLocation();


  /* =========================================================
     ADMIN ROUTES
  ========================================================= */

  const isAdminRoute =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");


  /* =========================================================
     USER LAYOUT
  ========================================================= */

  const showUserNavbar = !isAdminRoute;


  /* =========================================================
     ADMIN LAYOUT
  ========================================================= */

  const showAdminNavbar = isAdminRoute;


  return (
    <>

      {/* =====================================================
          USER NAVBAR
      ===================================================== */}

      {showUserNavbar && <Navbar />}


      {/* =====================================================
          ADMIN NAVBAR
      ===================================================== */}

      {showAdminNavbar && <AdminNavbar />}


      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>

        {/* ===================================================
            PUBLIC ROUTES
        =================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/job-listings"
          element={<JobListings />}
        />

        <Route
          path="/job/:id"
          element={<JobDetails />}
        />


        {/* ===================================================
            AUTHENTICATION
        =================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<OTPVerify />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* ===================================================
            USER PROTECTED ROUTES
        =================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute>
              <ApplyJob />
            </ProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN AUTHENTICATION
        =================================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-register"
          element={<AdminRegister />}
        />


        {/* ===================================================
            ADMIN DASHBOARD
        =================================================== */}

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN PROFILE
        =================================================== */}

        <Route
          path="/admin/profile"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN MANAGE JOBS
        =================================================== */}

        <Route
          path="/admin/jobs"
          element={
            <AdminProtectedRoute>
              <ManageJobs />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN APPLICATIONS
        =================================================== */}

        <Route
          path="/admin/applications"
          element={
            <AdminProtectedRoute>
              <AdminApplications />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN USERS
        =================================================== */}

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <UserProfiles />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN POSTED JOBS
        =================================================== */}

        <Route
          path="/admin/posted-jobs"
          element={
            <AdminProtectedRoute>
              <PostedJobs />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN SHORTLISTED
        =================================================== */}

        <Route
          path="/admin/shortlisted"
          element={
            <AdminProtectedRoute>
              <ShortlistedCandidates />
            </AdminProtectedRoute>
          }
        />


        {/* ===================================================
            ADMIN REJECTED
        =================================================== */}

        <Route
          path="/admin/rejected"
          element={
            <AdminProtectedRoute>
              <RejectedCandidates />
            </AdminProtectedRoute>
          }
        />

      </Routes>


      {/* =====================================================
          TOAST
      ===================================================== */}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />


      {/* =====================================================
          USER FOOTER ONLY
      ===================================================== */}

      {showUserNavbar && <Footer />}

    </>
  );
}

export default App;
