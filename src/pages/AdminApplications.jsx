import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/AdminApplications.css";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // CURRENT ADMIN ID
  // ==========================================
  const adminId = sessionStorage.getItem("admin_id");

  // ==========================================
  // ACTIVE FILTER
  // ==========================================
  const [activeFilter, setActiveFilter] = useState("All");

  // ==========================================
  // FETCH ALL APPLICATIONS
  // ==========================================
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/all-applications",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("ADMIN APPLICATIONS =", data);

      if (response.ok && data.status === "success") {
        setApplications(data.applications || []);
      } else {
        toast.error(
          data.message || "Failed To Load Applications"
        );
      }
    } catch (error) {
      console.log("FETCH APPLICATIONS ERROR =", error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================
  useEffect(() => {
    fetchApplications();
  }, []);

  // ==========================================
  // UPDATE APPLICATION STATUS
  // ==========================================
  const updateStatus = async (applicationId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update-application-status/${applicationId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      console.log("STATUS UPDATE RESPONSE =", data);

      if (response.ok && data.status === "success") {
        toast.success(data.message);

        setApplications((previousApplications) =>
          previousApplications.map((app) =>
            app.id === applicationId
              ? {
                  ...app,
                  status: status,
                }
              : app
          )
        );
      } else {
        toast.error(
          data.message || "Failed To Update Application"
        );
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR =", error);
      toast.error("Server Error");
    }
  };

  // ==========================================
  // VIEW RESUME
  // ==========================================
  const viewResume = (resume) => {
    if (!resume) {
      toast.warning("Resume Not Available");
      return;
    }

    const cleanPath = resume.replace(/\\/g, "/");

    const filename = cleanPath.split("/").pop();

    if (!filename) {
      toast.warning("Invalid Resume Path");
      return;
    }

    const resumeUrl =
      `http://localhost:5000/uploads/resumes/${encodeURIComponent(
        filename
      )}`;

    console.log("RESUME URL =", resumeUrl);

    window.open(resumeUrl, "_blank");
  };

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================
  const filteredApplications = applications.filter((app) => {
    if (activeFilter === "All") {
      return true;
    }

    return app.status === activeFilter;
  });

  // ==========================================
  // COUNTS
  // ==========================================
  const allCount = applications.length;

  const pendingCount = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const shortlistedCount = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  // ==========================================
  // LOADING SCREEN
  // ==========================================
  if (loading) {
    return (
      <>
        <AdminNavbar />

        <div className="admin-applications-page">
          <div className="container">
            <div className="application-loading">
              <div
                className="spinner-border text-primary"
                role="status"
              ></div>

              <p className="application-loading-text">
                Loading Applications...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================
  return (
    <>
      <AdminNavbar />

      <div className="admin-applications-page">

        {/* =====================================
            DASHBOARD BUTTON
        ===================================== */}
        <div className="container admin-applications-top">
          <div className="d-flex justify-content-end">
            <Link
              to="/admin"
              className="admin-dashboard-btn"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}
        <div className="container my-4">

          {/* ===================================
              HEADER
          =================================== */}
          <div className="admin-applications-header">
            <div>
              <h2 className="admin-applications-title">
                📄 Job Applications
              </h2>

              <p className="admin-applications-subtitle">
                Review and manage candidate applications
              </p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={fetchApplications}
            >
              🔄 Refresh
            </button>
          </div>

          {/* ===================================
              FILTER BUTTONS
          =================================== */}
          <div className="application-filters">

            <button
              type="button"
              className={`application-filter-btn ${
                activeFilter === "All"
                  ? "active-filter all-filter"
                  : ""
              }`}
              onClick={() => setActiveFilter("All")}
            >
              All
              <span>{allCount}</span>
            </button>

            <button
              type="button"
              className={`application-filter-btn ${
                activeFilter === "Pending"
                  ? "active-filter pending-filter"
                  : ""
              }`}
              onClick={() => setActiveFilter("Pending")}
            >
              Pending
              <span>{(pendingCount)}</span>
            </button>

            <button
              type="button"
              className={`application-filter-btn ${
                activeFilter === "Shortlisted"
                  ? "active-filter shortlisted-filter"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("Shortlisted")
              }
            >
              Shortlisted
              <span>{shortlistedCount}</span>
            </button>

            <button
              type="button"
              className={`application-filter-btn ${
                activeFilter === "Rejected"
                  ? "active-filter rejected-filter"
                  : ""
              }`}
              onClick={() => setActiveFilter("Rejected")}
            >
              Rejected
              <span>{rejectedCount}</span>
            </button>
          </div>

          {/* ===================================
              APPLICATION COUNT
          =================================== */}
          <div className="application-count">
            {activeFilter} Applications:{" "}
            {filteredApplications.length}
          </div>

          {/* ===================================
              NO APPLICATIONS
          =================================== */}
          {filteredApplications.length === 0 ? (
            <div className="no-applications">
              <h5>
                No {activeFilter} Applications Found
              </h5>

              <p>
                There are no{" "}
                {activeFilter.toLowerCase()}{" "}
                candidates at the moment.
              </p>
            </div>
          ) : (

            /* =================================
               APPLICATION CARDS
            ================================= */
            <div className="row">

              {filteredApplications.map((app) => {

                // =================================
                // CHECK JOB OWNER
                // =================================
                const isJobOwner =
                  String(app.job_admin_id) ===
                  String(adminId);

                return (
                  <div
                    className="col-lg-4 col-md-6 mb-4"
                    key={app.id}
                  >

                    <div className="application-card">

                      <div className="application-card-body">

                        {/* =========================
                            CANDIDATE
                        ========================= */}
                        <div className="candidate-header">
                          <div>
                            <h4 className="application-candidate-name">
                              {app.username || "N/A"}
                            </h4>

                            <span className="candidate-label">
                              Candidate
                            </span>
                          </div>

                          <span
                            className={`application-status ${
                              app.status === "Shortlisted"
                                ? "status-shortlisted"
                                : app.status === "Rejected"
                                ? "status-rejected"
                                : "status-pending"
                            }`}
                          >
                            {app.status || "Pending"}
                          </span>
                        </div>

                        <hr className="application-divider" />

                        {/* EMAIL */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Email
                          </span>

                          <span className="application-detail-value">
                            {app.email || "N/A"}
                          </span>
                        </div>

                        {/* PHONE */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Phone
                          </span>

                          <span className="application-detail-value">
                            {app.phone || "N/A"}
                          </span>
                        </div>

                        {/* JOB TITLE */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Job
                          </span>

                          <span className="application-detail-value">
                            {app.job_title || "N/A"}
                          </span>
                        </div>

                        {/* COMPANY */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Company
                          </span>

                          <span className="application-detail-value">
                            {app.company_name || "N/A"}
                          </span>
                        </div>

                        {/* LOCATION */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Location
                          </span>

                          <span className="application-detail-value">
                            {app.location || "N/A"}
                          </span>
                        </div>

                        {/* SALARY */}
                        {app.salary && (
                          <div className="application-detail">
                            <span className="application-detail-label">
                              Salary
                            </span>

                            <span className="application-detail-value">
                              {app.salary}
                            </span>
                          </div>
                        )}

                        {/* EXPERIENCE */}
                        {app.experience && (
                          <div className="application-detail">
                            <span className="application-detail-label">
                              Experience
                            </span>

                            <span className="application-detail-value">
                              {app.experience}
                            </span>
                          </div>
                        )}

                        {/* JOB TYPE */}
                        {app.job_type && (
                          <div className="application-detail">
                            <span className="application-detail-label">
                              Job Type
                            </span>

                            <span className="application-detail-value">
                              {app.job_type}
                            </span>
                          </div>
                        )}

                        {/* APPLIED DATE */}
                        <div className="application-detail">
                          <span className="application-detail-label">
                            Applied
                          </span>

                          <span className="application-detail-value">
                            {app.applied_date
                              ? new Date(
                                  app.applied_date
                                ).toLocaleString()
                              : "N/A"}
                          </span>
                        </div>

                        {/* =================================
                            ACTION SECTION
                        ================================= */}
                        <div className="application-actions">

                          {/* VIEW RESUME */}
                          {app.resume && (
                            <button
                              type="button"
                              className="resume-btn"
                              onClick={() =>
                                viewResume(app.resume)
                              }
                            >
                              📄 View Resume
                            </button>
                          )}

                          {/* =================================
                              OWNER + PENDING
                          ================================= */}
                          {isJobOwner &&
                            app.status === "Pending" && (
                              <div className="decision-buttons">

                                <button
                                  type="button"
                                  className="accept-btn"
                                  onClick={() =>
                                    updateStatus(
                                      app.id,
                                      "Shortlisted"
                                    )
                                  }
                                >
                                  ✓ Accept
                                </button>

                                <button
                                  type="button"
                                  className="reject-btn"
                                  onClick={() =>
                                    updateStatus(
                                      app.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  ✕ Reject
                                </button>

                              </div>
                            )}

                          {/* =================================
                              OWNER + SHORTLISTED
                          ================================= */}
                          {isJobOwner &&
                            app.status === "Shortlisted" && (
                              <div className="processed-message processed-success">
                                ✓ Candidate Shortlisted
                              </div>
                            )}

                          {/* =================================
                              OWNER + REJECTED
                          ================================= */}
                          {isJobOwner &&
                            app.status === "Rejected" && (
                              <div className="processed-message processed-rejected">
                                ✕ Candidate Rejected
                              </div>
                            )}

                          {/* =================================
                              OTHER ADMIN
                              NO BIG VIEW ONLY MESSAGE
                          ================================= */}
                          {!isJobOwner && (
                            <div className="admin-view-badge">
                              👁️ View
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminApplications;
