import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminNavbar.css";

function AdminNavbar() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [adminName, setAdminName] =
    useState("Admin");

  const navigate = useNavigate();

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-profile",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setAdminName(
          data.admin.username
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data =
        await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        sessionStorage.clear();

        toast.success(
          data.message
        );

        navigate("/admin-login");
      } else {
        toast.error(
          data.message
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        "Logout Failed"
      );
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

        <h4>
          Job Portal Admin
        </h4>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`admin-sidebar ${
          sidebarOpen ? "show" : ""
        }`}
      >
        <div className="sidebar-top">
          <div>
            <h3>
              🚀 Admin Panel
            </h3>

            <small>
              Welcome, {adminName}
            </small>
          </div>

          <button
            className="close-btn"
            onClick={closeSidebar}
          >
            ✕
          </button>
        </div>

        <Link
          to="/admin"
          onClick={closeSidebar}
        >
          📊 Dashboard
        </Link>

        <Link
          to="/admin/jobs"
          onClick={closeSidebar}
        >
          💼 Manage Jobs
        </Link>

        <Link
          to="/admin/applications"
          onClick={closeSidebar}
        >
          📄 Applications
        </Link>

        <Link
          to="/admin/users"
          onClick={closeSidebar}
        >
          👥 Users
        </Link>

        <Link
          to="/admin/posted-jobs"
          onClick={closeSidebar}
        >
          📢 Posted Jobs
        </Link>

        <Link
          to="/admin/shortlisted"
          onClick={closeSidebar}
        >
          ✅ Shortlisted
        </Link>

        <Link
          to="/admin/rejected"
          onClick={closeSidebar}
        >
          ❌ Rejected
        </Link>

        <Link
          to="/admin/profile"
          onClick={closeSidebar}
        >
          👤 Profile
        </Link>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </>
  );
}

export default AdminNavbar;

