
import { useEffect, useState } from "react";
import "../styles/MyApplications.css";

function MyApplications() {
  const [myApplications, setMyApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");

  const applicationsPerPage = 6;

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    fetch(
      `http://localhost:5000/api/my-applications/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("My Applications:", data);

        if (data.status === "success") {
          setMyApplications(data.applications || []);
        }
      })
      .catch((err) => {
        console.log("Applications Error:", err);
      });
  }, []);

  /* =========================
     COUNTS
  ========================= */

  const allCount = myApplications.length;

  const pendingCount = myApplications.filter(
    (app) => app.status === "Pending"
  ).length;

  const shortlistedCount = myApplications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const rejectedCount = myApplications.filter(
    (app) => app.status === "Rejected"
  ).length;

  /* =========================
     FILTER APPLICATIONS
  ========================= */

  const filteredApplications =
    activeFilter === "All"
      ? myApplications
      : myApplications.filter(
          (app) => app.status === activeFilter
        );

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.ceil(
    filteredApplications.length / applicationsPerPage
  );

  const indexOfLastApplication =
    currentPage * applicationsPerPage;

  const indexOfFirstApplication =
    indexOfLastApplication - applicationsPerPage;

  const currentApplications =
    filteredApplications.slice(
      indexOfFirstApplication,
      indexOfLastApplication
    );

  /* =========================
     FILTER CHANGE
  ========================= */

  const changeFilter = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  /* =========================
     RESUME URL
  ========================= */

  const getResumeUrl = (resume) => {
    if (!resume) return "#";

    const fileName = resume
      .replace(/\\/g, "/")
      .split("/")
      .pop();

    return `http://localhost:5000/uploads/resumes/${encodeURIComponent(
      fileName
    )}`;
  };

  /* =========================
     STATUS CLASS
  ========================= */

  const getStatusClass = (status) => {
    if (status === "Shortlisted") {
      return "badge bg-success";
    }

    if (status === "Rejected") {
      return "badge bg-danger";
    }

    return "badge bg-warning text-dark";
  };

  return (
    <div className="container my-5 my-applications-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="d-flex justify-content-between align-items-center mb-4 applications-header">

        <div>
          <h2 className="fw-bold mb-1">
            📄 My Applications
          </h2>

          <p className="text-muted mb-0">
            Track your job applications and application status.
          </p>
        </div>

        <span className="badge bg-primary fs-6">
          Total: {myApplications.length}
        </span>

      </div>

      {/* =========================
          FILTER BUTTONS
      ========================= */}

      <div className="application-filters">

        <button
          type="button"
          className={`filter-btn ${
            activeFilter === "All"
              ? "active all-active"
              : ""
          }`}
          onClick={() => changeFilter("All")}
        >
          <span>All</span>

          <span className="filter-count">
            {allCount}
          </span>
        </button>

        <button
          type="button"
          className={`filter-btn ${
            activeFilter === "Pending"
              ? "active pending-active"
              : ""
          }`}
          onClick={() => changeFilter("Pending")}
        >
          <span>Pending</span>

          <span className="filter-count">
            {pendingCount}
          </span>
        </button>

        <button
          type="button"
          className={`filter-btn ${
            activeFilter === "Shortlisted"
              ? "active shortlisted-active"
              : ""
          }`}
          onClick={() => changeFilter("Shortlisted")}
        >
          <span>Shortlisted</span>

          <span className="filter-count">
            {shortlistedCount}
          </span>
        </button>

        <button
          type="button"
          className={`filter-btn ${
            activeFilter === "Rejected"
              ? "active rejected-active"
              : ""
          }`}
          onClick={() => changeFilter("Rejected")}
        >
          <span>Rejected</span>

          <span className="filter-count">
            {rejectedCount}
          </span>
        </button>

      </div>

      {/* =========================
          APPLICATIONS
      ========================= */}

      {myApplications.length === 0 ? (

        <div className="card shadow border-0">
          <div className="card-body text-center p-5">

            <div className="empty-icon">
              📄
            </div>

            <h4 className="text-muted">
              No Applications Found
            </h4>

            <p className="mb-0">
              You haven't applied for any jobs yet.
            </p>

          </div>
        </div>

      ) : (

        <>

          {/* FILTER TITLE */}

          <div className="selected-filter-title">

            <h5>
              {activeFilter === "All"
                ? "All Applications"
                : `${activeFilter} Applications`}
            </h5>

            <span>
              {filteredApplications.length} application
              {filteredApplications.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

          {filteredApplications.length === 0 ? (

            <div className="card shadow border-0">
              <div className="card-body text-center p-5">

                <div className="empty-icon">
                  🔍
                </div>

                <h4 className="text-muted">
                  No {activeFilter} Applications
                </h4>

                <p className="mb-0">
                  You don't have any {activeFilter.toLowerCase()} applications.
                </p>

              </div>
            </div>

          ) : (

            <>

              <div className="row">

                {currentApplications.map((app) => (

                  <div
                    key={app.id}
                    className="col-lg-4 col-md-6 mb-4"
                  >

                    <div className="card shadow-lg border-0 h-100 application-card">

                      <div className="card-body">

                        {/* JOB TITLE */}

                        <h5 className="fw-bold application-title">
                          {app.job_title}
                        </h5>

                        {/* COMPANY */}

                        <h6 className="text-primary company-name">
                          {app.company_name}
                        </h6>

                        <hr />

                        {/* LOCATION */}

                        <p>
                          📍{" "}
                          <strong>
                            Location:
                          </strong>{" "}
                          {app.location || "Not Specified"}
                        </p>

                        {/* SALARY */}

                        <p>
                          💰{" "}
                          <strong>
                            Salary:
                          </strong>{" "}
                          {app.salary || "Not Specified"}
                        </p>

                        {/* EXPERIENCE */}

                        <p>
                          🧑‍💻{" "}
                          <strong>
                            Experience:
                          </strong>{" "}
                          {app.experience || "Not Specified"}
                        </p>

                        {/* APPLIED DATE */}

                        <p>
                          📅{" "}
                          <strong>
                            Applied:
                          </strong>{" "}
                          {app.applied_date
                            ? new Date(
                                app.applied_date
                              ).toLocaleDateString()
                            : "Not Available"}
                        </p>

                        {/* STATUS */}

                        <div className="mb-3">

                          <strong>
                            Status:
                          </strong>{" "}

                          <span
                            className={getStatusClass(
                              app.status
                            )}
                          >
                            {app.status}
                          </span>

                        </div>

                        {/* RESUME */}

                        {app.resume && (

                          <a
                            href={getResumeUrl(
                              app.resume
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-success w-100"
                          >
                            📄 View Resume
                          </a>

                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* =========================
                  PAGINATION
              ========================= */}

              {totalPages > 1 && (

                <nav className="mt-3">

                  <ul className="pagination justify-content-center">

                    {/* PREVIOUS */}

                    <li
                      className={`page-item ${
                        currentPage === 1
                          ? "disabled"
                          : ""
                      }`}
                    >

                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(
                            currentPage - 1
                          )
                        }
                        disabled={
                          currentPage === 1
                        }
                      >
                        Previous
                      </button>

                    </li>

                    {/* PAGE NUMBERS */}

                    {[...Array(totalPages)].map(
                      (_, index) => (

                        <li
                          key={index}
                          className={`page-item ${
                            currentPage ===
                            index + 1
                              ? "active"
                              : ""
                          }`}
                        >

                          <button
                            className="page-link"
                            onClick={() =>
                              setCurrentPage(
                                index + 1
                              )
                            }
                          >
                            {index + 1}
                          </button>

                        </li>

                      )
                    )}

                    {/* NEXT */}

                    <li
                      className={`page-item ${
                        currentPage === totalPages
                          ? "disabled"
                          : ""
                      }`}
                    >

                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(
                            currentPage + 1
                          )
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                      >
                        Next
                      </button>

                    </li>

                  </ul>

                </nav>

              )}

            </>

          )}

        </>

      )}

    </div>
  );
}

export default MyApplications;
