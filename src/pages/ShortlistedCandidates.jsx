
import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import AdminNavbar from "../components/AdminNavbar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ShortlistedCandidates.css";

function ShortlistedCandidates() {
  const [shortlisted, setShortlisted] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();

  /* =====================================================
     ADMIN LOGIN CHECK
  ===================================================== */

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");

    if (isAdmin !== "true") {
      toast.error("Please Login As Admin");
      navigate("/admin-login");
      return;
    }

    loadShortlistedCandidates();
  }, [navigate]);

  /* =====================================================
     LOAD SHORTLISTED CANDIDATES
  ===================================================== */

  const loadShortlistedCandidates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/shortlisted-candidates",
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setShortlisted(response.data.candidates || []);

        if (isRefresh) {
          toast.success("Shortlisted Candidates Refreshed");
        }
      } else {
        toast.error(
          response.data.message || "Failed To Load Candidates"
        );
      }
    } catch (error) {
      console.error("SHORTLISTED ERROR:", error);

      toast.error("Failed To Load Candidates");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    loadShortlistedCandidates(true);
  };

  /* =====================================================
     DOWNLOAD EXCEL - EXCELJS
  ===================================================== */

  const downloadExcel = async () => {
    if (shortlisted.length === 0) {
      toast.warning("No Shortlisted Candidates Available");
      return;
    }

    try {
      setDownloading(true);

      /* ================================================
         CREATE WORKBOOK
      ================================================ */

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "Job Portal Admin";
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet(
        "Shortlisted Candidates"
      );

      /* ================================================
         TITLE
      ================================================ */

      worksheet.mergeCells("A1:I1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "SHORTLISTED CANDIDATES";

      titleCell.font = {
        bold: true,
        size: 16,
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 28;

      /* ================================================
         TOTAL COUNT
      ================================================ */

      worksheet.mergeCells("A2:I2");

      const countCell = worksheet.getCell("A2");

      countCell.value = `Total Shortlisted Candidates : ${shortlisted.length}`;

      countCell.font = {
        bold: true,
        size: 12,
      };

      countCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(2).height = 22;

      /* ================================================
         EMPTY ROW
      ================================================ */

      worksheet.addRow([]);

      /* ================================================
         HEADERS
      ================================================ */

      const headerRow = worksheet.addRow([
        "S.No",
        "Candidate Name",
        "Email",
        "Phone",
        "State",
        "Job Title",
        "Skills",
        "Applied Date",
        "Status",
      ]);

      headerRow.height = 25;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          size: 11,
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: {
            style: "thin",
          },
          left: {
            style: "thin",
          },
          bottom: {
            style: "thin",
          },
          right: {
            style: "thin",
          },
        };
      });

      /* ================================================
         CANDIDATE DATA
      ================================================ */

      shortlisted.forEach((candidate, index) => {
        const appliedDate = candidate.applied_date
          ? new Date(
              candidate.applied_date
            ).toLocaleDateString()
          : "N/A";

        const row = worksheet.addRow([
          index + 1,
          candidate.username || "N/A",
          candidate.email || "N/A",
          candidate.phone || "N/A",
          candidate.state || "N/A",
          candidate.job_title || "N/A",
          candidate.skills || "N/A",
          appliedDate,
          "Shortlisted",
        ]);

        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            top: {
              style: "thin",
            },
            left: {
              style: "thin",
            },
            bottom: {
              style: "thin",
            },
            right: {
              style: "thin",
            },
          };
        });

        row.height = 25;
      });

      /* ================================================
         COLUMN WIDTHS
      ================================================ */

      worksheet.columns = [
        {
          key: "sno",
          width: 8,
        },
        {
          key: "name",
          width: 25,
        },
        {
          key: "email",
          width: 32,
        },
        {
          key: "phone",
          width: 16,
        },
        {
          key: "state",
          width: 18,
        },
        {
          key: "job",
          width: 28,
        },
        {
          key: "skills",
          width: 40,
        },
        {
          key: "date",
          width: 18,
        },
        {
          key: "status",
          width: 16,
        },
      ];

      /* ================================================
         FREEZE HEADER
      ================================================ */

      worksheet.views = [
        {
          state: "frozen",
          ySplit: 4,
        },
      ];

      /* ================================================
         AUTO FILTER
      ================================================ */

      worksheet.autoFilter = {
        from: "A4",
        to: "I4",
      };

      /* ================================================
         GENERATE EXCEL FILE
      ================================================ */

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob(
        [buffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Shortlisted_Candidates_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        `${shortlisted.length} Shortlisted Candidates Exported`
      );
    } catch (error) {
      console.error("EXCEL DOWNLOAD ERROR:", error);

      toast.error("Failed To Download Excel");
    } finally {
      setDownloading(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <>
        <AdminNavbar />

        <div className="container mt-5 text-center">
          <h3>Loading...</h3>
        </div>
      </>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <>
      <AdminNavbar />

      <div className="shortlisted-page">

        <div className="container-fluid px-0">

          {/* =================================================
              TOP ACTIONS
          ================================================= */}

          <div className="shortlisted-top-actions">

            <Link
              to="/admin"
              className="btn btn-dark rounded-pill px-4"
            >
              ← Dashboard
            </Link>

            <div className="shortlisted-action-buttons">

              {/* REFRESH */}

              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>

                    Refreshing...
                  </>
                ) : (
                  <>↻ Refresh</>
                )}
              </button>

              {/* DOWNLOAD EXCEL */}

              <button
                type="button"
                className="btn btn-success rounded-pill px-4"
                onClick={downloadExcel}
                disabled={
                  shortlisted.length === 0 ||
                  downloading
                }
              >
                {downloading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>

                    Downloading...
                  </>
                ) : (
                  <>📊 Download Excel</>
                )}
              </button>

            </div>

          </div>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="shortlisted-header">

            <div>

              <h1>
                🎯 Shortlisted Candidates
              </h1>

              <p>
                Successfully selected candidates for
                further hiring process.
              </p>

            </div>

            {/* TOTAL COUNT */}

            <div className="shortlisted-count-box">

              <span className="count-number">
                {shortlisted.length}
              </span>

              <span className="count-label">
                Shortlisted Candidates
              </span>

            </div>

          </div>

          {/* =================================================
              CANDIDATES
          ================================================= */}

          {shortlisted.length === 0 ? (

            <div className="alert alert-success">
              No Shortlisted Candidates Found
            </div>

          ) : (

            shortlisted.map((candidate, index) => (

              <div
                key={candidate.id}
                className="card shortlisted-card"
              >

                <div className="card-body p-4">

                  <div className="row align-items-center">

                    {/* ======================================
                        PROFILE IMAGE
                    ====================================== */}

                    <div className="col-lg-2 text-center">

                      <img
                        src={
                          candidate.profile_image
                            ? `http://localhost:5000/${candidate.profile_image}`
                            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="profile"
                        className="candidate-img"
                      />

                    </div>

                    {/* ======================================
                        CANDIDATE DETAILS
                    ====================================== */}

                    <div className="col-lg-7">

                      <div className="candidate-number">
                        Candidate #{index + 1}
                      </div>

                      <h3 className="candidate-name">
                        {candidate.username}
                      </h3>

                      <p>
                        📧 {candidate.email}
                      </p>

                      <p>
                        📱 {candidate.phone || "N/A"}
                      </p>

                      <p>
                        📍 {candidate.state || "N/A"}
                      </p>

                      <p>
                        💼 <b>
                          {candidate.job_title || "N/A"}
                        </b>
                      </p>

                      <p>
                        📅 Applied :{" "}
                        {candidate.applied_date
                          ? new Date(
                              candidate.applied_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                      {/* SKILLS */}

                      <div className="skills-wrapper">

                        {candidate.skills ? (
                          candidate.skills
                            .split(",")
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="badge bg-success me-2 mb-2"
                              >
                                {skill.trim()}
                              </span>
                            ))
                        ) : (
                          <span>
                            No Skills Available
                          </span>
                        )}

                      </div>

                    </div>

                    {/* ======================================
                        ACTIONS
                    ====================================== */}

                    <div className="col-lg-3 text-lg-end">

                      <span className="badge bg-success fs-6 px-4 py-2">
                        ✔ Shortlisted
                      </span>

                      <div className="d-grid gap-2 mt-3">

                        {/* VIEW PROFILE */}

                        <button
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() =>
                            setSelectedUser(candidate)
                          }
                        >
                          👤 View Profile
                        </button>

                        {/* VIEW RESUME */}

                        {candidate.resume_path && (
                          <a
                            href={`http://localhost:5000/${candidate.resume_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-success"
                          >
                            📄 View Resume
                          </a>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

        {/* =====================================================
            PROFILE MODAL
        ===================================================== */}

        {selectedUser && (

          <div className="custom-modal">

            <div className="custom-modal-content">

              {/* MODAL HEADER */}

              <div className="custom-modal-header">

                <h4>
                  Candidate Profile
                </h4>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setSelectedUser(null)
                  }
                ></button>

              </div>

              {/* MODAL BODY */}

              <div className="custom-modal-body">

                <div className="text-center mb-4">

                  <img
                    src={
                      selectedUser.profile_image
                        ? `http://localhost:5000/${selectedUser.profile_image}`
                        : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt="profile"
                    className="modal-profile-img"
                  />

                </div>

                <h3>
                  {selectedUser.username}
                </h3>

                <p>
                  📧 {selectedUser.email}
                </p>

                <p>
                  📱 {selectedUser.phone || "N/A"}
                </p>

                <p>
                  📍 {selectedUser.state || "N/A"}
                </p>

                <hr />

                <h5>
                  🎓 Education
                </h5>

                <p>
                  10th :{" "}
                  {selectedUser.tenth || "N/A"}
                </p>

                <p>
                  Intermediate :{" "}
                  {selectedUser.intermediate || "N/A"}
                </p>

                <p>
                  Degree :{" "}
                  {selectedUser.degree || "N/A"}
                </p>

                <p>
                  College :{" "}
                  {selectedUser.college || "N/A"}
                </p>

                <p>
                  Branch :{" "}
                  {selectedUser.branch || "N/A"}
                </p>

                <hr />

                <h5>
                  🛠 Skills
                </h5>

                <p>
                  {selectedUser.skills || "No Skills"}
                </p>

                {/* MODAL RESUME */}

                {selectedUser.resume_path && (

                  <a
                    href={`http://localhost:5000/${selectedUser.resume_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-success mt-3"
                  >
                    📄 View Resume
                  </a>

                )}

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default ShortlistedCandidates;
