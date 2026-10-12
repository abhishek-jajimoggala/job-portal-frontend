import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const isAdmin =
  sessionStorage.getItem("admin") === "true";

  const [stats, setStats] = useState({
    total_users: 0,
    total_jobs: 0,
    total_applications: 0,
    selected_candidates: 0,
    rejected_candidates: 0,
  });

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard"
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setStats(data.dashboard);
      }
    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );
    }
  };

  fetchDashboard();
}, []);

  if (!isAdmin) {
    return <Navigate to="/admin-login" />;
  }

  const pending = Math.max(0,
  stats.total_applications -
    stats.selected_candidates -
    stats.rejected_candidates
);

  return (
    <>
      <AdminNavbar />

      <div className="admin-dashboard">

        {/* Hero Section */}
        <div className="dashboard-hero mb-5">
          <div className="row align-items-center">

            <div className="col-lg-8">
              <h1 className="display-5 fw-bold text-white">
                Welcome Back, Admin 👋
              </h1>

              <div className="alert alert-info border-0 shadow-sm rounded-4">
                🚀 Welcome Admin! Monitor hiring activity,
                manage jobs and track candidates in real time.
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Admin"
                width="180"
              />
            </div>

          </div>
        </div>

        {/* Statistics */}
        <div className="row g-4 mb-5">

          <div className="col">
            <div className="modern-card blue-card">
              <h2>{stats.total_users}</h2>
              <p>Total Users</p>
            </div>
          </div>

          <div className="col">
            <div className="modern-card green-card">
              <h2>{stats.total_jobs}</h2>
              <p>Jobs Posted</p>
            </div>
          </div>

          <div className="col">
            <div className="modern-card cyan-card">
              <h2>{stats.total_applications}</h2>
              <p>Applications</p>
            </div>
          </div>

          <div className="col">
            <div className="modern-card orange-card">
              <h2>{stats.selected_candidates}</h2>
              <p>Selected</p>
            </div>
          </div>

          <div className="col">
            <div className="modern-card red-card">
              <h2>{stats.rejected_candidates}</h2>
              <p>Rejected</p>
            </div>
          </div>

          <div className="col">
            <div className="modern-card purple-card">
              <h2>{pending}</h2>
              <p>Pending</p>
            </div>
          </div>

        </div>

        {/* Dashboard Insights */}
        <div className="row mt-5">

          {/* Recent Activity */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold">
                    Recent Activity
                  </h4>

                  <span className="badge bg-success">
                    Live
                  </span>
                </div>

                <div className="activity-card users">
                  <div>
                    <h6>Total Users</h6>
                    <h3>{stats.total_users}</h3>
                  </div>
                  <span className="activity-icon">
                    👥
                  </span>
                </div>

                <div className="activity-card jobs">
                  <div>
                    <h6>Jobs Posted</h6>
                    <h3>{stats.total_jobs}</h3>
                  </div>
                  <span className="activity-icon">
                    💼
                  </span>
                </div>

                <div className="activity-card apps">
                  <div>
                    <h6>Applications</h6>
                    <h3>{stats.total_applications}</h3>
                  </div>
                  <span className="activity-icon">
                    📄
                  </span>
                </div>

                <div className="activity-card shortlist">
                  <div>
                    <h6>Selected</h6>
                    <h3>{stats.selected_candidates}</h3>
                  </div>
                  <span className="activity-icon">
                    ✅
                  </span>
                </div>

                <div className="activity-card reject">
                  <div>
                    <h6>Rejected</h6>
                    <h3>{stats.rejected_candidates}</h3>
                  </div>
                  <span className="activity-icon">
                    ❌
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Hiring Progress */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow border-0 h-100">
              <div className="card-body">

                <h4 className="fw-bold mb-4">
                  Hiring Progress
                </h4>

                <p className="fw-semibold">
                  Applications
                </p>

                <div
                  className="progress mb-4"
                  style={{ height: "25px" }}
                >
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: "100%" }}
                  >
                    {stats.total_applications}
                  </div>
                </div>

                <p className="fw-semibold">
                  Selected
                </p>

                <div
                  className="progress mb-4"
                  style={{ height: "25px" }}
                >
                  <div
                    className="progress-bar bg-success"
                    style={{
                      width: `${
                        stats.total_applications
                          ? (stats.selected_candidates /
                              stats.total_applications) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    {stats.selected_candidates}
                  </div>
                </div>

                <p className="fw-semibold">
                  Rejected
                </p>

                <div
                  className="progress mb-4"
                  style={{ height: "25px" }}
                >
                  <div
                    className="progress-bar bg-danger"
                    style={{
                      width: `${
                        stats.total_applications
                          ? (stats.rejected_candidates /
                              stats.total_applications) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    {stats.rejected_candidates}
                  </div>
                </div>

                <p className="fw-semibold">
                  Pending
                </p>

                <div
                  className="progress"
                  style={{ height: "25px" }}
                >
                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width: `${
                        stats.total_applications
                          ? (pending /
                              stats.total_applications) *
                            100
                          : 0
                      }%`,
                    }}
                  >
                    {pending}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default AdminDashboard;