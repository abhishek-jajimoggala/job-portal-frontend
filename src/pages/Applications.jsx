
import { useEffect, useState } from "react";
import "../styles/Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const applicationsPerPage = 5;

  /* =========================================
     FETCH USER APPLICATIONS
  ========================================= */

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      console.log("User ID not found");
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:5000/api/my-applications/${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch applications"
          );
        }

        return response.json();
      })
      .then((data) => {
        console.log(
          "Applications API Response:",
          data
        );

        if (data.status === "success") {
          setApplications(
            data.applications || []
          );
        } else {
          setApplications([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Applications fetch error:",
          error
        );

        setApplications([]);
        setLoading(false);
      });
  }, []);


  /* =========================================
     STATUS STYLE
  ========================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Shortlisted":
        return "badge bg-success";

      case "Rejected":
        return "badge bg-danger";

      case "Pending":
      default:
        return "badge bg-warning text-dark";
    }
  };


  /* =========================================
     PAGINATION
  ========================================= */

  const totalPages = Math.ceil(
    applications.length /
      applicationsPerPage
  );

  const indexOfLast =
    currentPage *
    applicationsPerPage;

  const indexOfFirst =
    indexOfLast -
    applicationsPerPage;

  const currentApplications =
    applications.slice(
      indexOfFirst,
      indexOfLast
    );


  /* =========================================
     PAGE CHANGE
  ========================================= */

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="container my-5">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="mb-4">

        <h2 className="fw-bold">
          My Applications
        </h2>

        <p className="text-muted mb-0">
          Track your job applications and
          application status.
        </p>

      </div>


      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (

        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3">
            Loading applications...
          </p>

        </div>

      ) : (

        <>

          {/* =================================
              APPLICATION TABLE
          ================================= */}

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              {/* TABLE HEADER */}

              <thead className="table-dark">

                <tr>

                  <th>
                    Job Title
                  </th>

                  <th>
                    Company
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Applied Date
                  </th>

                  <th>
                    Resume
                  </th>

                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody>

                {currentApplications.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-5"
                    >

                      <h5 className="mb-2">
                        No Applications Found
                      </h5>

                      <p className="text-muted mb-0">
                        You have not applied
                        for any jobs yet.
                      </p>

                    </td>

                  </tr>

                ) : (

                  currentApplications.map(
                    (app) => (

                      <tr key={app.id}>

                        {/* JOB TITLE */}

                        <td>

                          <strong>
                            {app.job_title ||
                              "N/A"}
                          </strong>

                        </td>


                        {/* COMPANY */}

                        <td>
                          {app.company_name ||
                            "N/A"}
                        </td>


                        {/* LOCATION */}

                        <td>
                          {app.location ||
                            "N/A"}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={getStatusClass(
                              app.status
                            )}
                          >
                            {app.status ||
                              "Pending"}
                          </span>

                        </td>


                        {/* APPLIED DATE */}

                        <td>

                          {app.applied_date ? (
                            new Date(
                              app.applied_date
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          ) : (
                            "N/A"
                          )}

                        </td>


                        {/* RESUME */}

                        <td>

                          {app.resume ? (

                            <a
                              href={`http://localhost:5000/uploads/resumes/${app.resume}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-success btn-sm"
                            >
                              View Resume
                            </a>

                          ) : (

                            <span className="text-muted">
                              No Resume
                            </span>

                          )}

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>


          {/* =================================
              PAGINATION
          ================================= */}

          {totalPages > 1 && (

            <nav
              aria-label="Applications pagination"
              className="mt-4"
            >

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
                    type="button"
                    className="page-link"
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      changePage(
                        currentPage - 1
                      )
                    }
                  >
                    Previous
                  </button>

                </li>


                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => {

                    const pageNumber =
                      index + 1;

                    return (

                      <li
                        key={pageNumber}
                        className={`page-item ${
                          currentPage ===
                          pageNumber
                            ? "active"
                            : ""
                        }`}
                      >

                        <button
                          type="button"
                          className="page-link"
                          onClick={() =>
                            changePage(
                              pageNumber
                            )
                          }
                        >
                          {pageNumber}
                        </button>

                      </li>

                    );
                  }
                )}


                {/* NEXT */}

                <li
                  className={`page-item ${
                    currentPage ===
                    totalPages
                      ? "disabled"
                      : ""
                  }`}
                >

                  <button
                    type="button"
                    className="page-link"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      changePage(
                        currentPage + 1
                      )
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

    </div>
  );
}

export default Applications;
