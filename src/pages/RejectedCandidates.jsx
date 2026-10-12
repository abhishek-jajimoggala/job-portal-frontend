
import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "./RejectedCandidates.css";

function RejectedCandidates() {
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");

    if (isAdmin !== "true") {
      toast.error("Please Login As Admin");
      navigate("/admin-login");
      return;
    }

    loadRejectedCandidates();
  }, [navigate]);

  // =========================
  // LOAD REJECTED CANDIDATES
  // =========================
  const loadRejectedCandidates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/rejected-candidates",
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setRejected(response.data.candidates || []);

        if (isRefresh) {
          toast.success("Rejected Candidates Refreshed");
        }
      } else {
        toast.error(
          response.data.message || "Failed To Load Candidates"
        );
      }
    } catch (error) {
      console.error("REJECTED CANDIDATES ERROR:", error);

      if (error.response?.status === 401) {
        toast.error("Please Login As Admin");

        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminId");
        sessionStorage.removeItem("adminName");

        navigate("/admin-login");
        return;
      }

      toast.error("Failed To Load Candidates");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const handleRefresh = () => {
    loadRejectedCandidates(true);
  };

  // =========================
  // DOWNLOAD EXCEL
  // =========================
  const downloadExcel = async () => {
    if (rejected.length === 0) {
      toast.warning("No Rejected Candidates Available");
      return;
    }

    try {
      setDownloading(true);

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "Job Portal Admin";
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet(
        "Rejected Candidates"
      );

      // =========================
      // TITLE
      // =========================
      worksheet.mergeCells("A1:I1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "REJECTED CANDIDATES";
      titleCell.font = {
        bold: true,
        size: 16,
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 28;

      // =========================
      // TOTAL COUNT
      // =========================
      worksheet.mergeCells("A2:I2");

      const countCell = worksheet.getCell("A2");

      countCell.value =
        `Total Rejected Candidates : ${rejected.length}`;

      countCell.font = {
        bold: true,
        size: 12,
      };

      countCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(2).height = 22;

      // Empty row
      worksheet.addRow([]);

      // =========================
      // HEADER
      // =========================
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
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // =========================
      // CANDIDATES
      // =========================
      rejected.forEach((candidate, index) => {
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
          "Rejected",
        ]);

        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        row.height = 25;
      });

      // =========================
      // COLUMN WIDTHS
      // =========================
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

      // =========================
      // FREEZE HEADER
      // =========================
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 4,
        },
      ];

      // =========================
      // FILTER
      // =========================
      worksheet.autoFilter = {
        from: "A4",
        to: "I4",
      };

      // =========================
      // CREATE EXCEL FILE
      // =========================
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download =
        `Rejected_Candidates_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        `${rejected.length} Rejected Candidates Exported`
      );
    } catch (error) {
      console.error("EXCEL DOWNLOAD ERROR:", error);

      toast.error("Failed To Download Excel");
    } finally {
      setDownloading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <AdminNavbar />

        <div className="rejected-loading">
          <div className="spinner-border text-danger"></div>

          <h4>Loading Rejected Candidates...</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="rejected-page">

        <div className="rejected-container">

          {/* =========================
              TOP ACTIONS
          ========================= */}

          <div className="rejected-top-actions">

            <Link
              to="/admin"
              className="btn btn-dark rejected-dashboard-btn"
            >
              ← Dashboard
            </Link>

            <div className="rejected-action-buttons">

              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Refreshing...
                  </>
                ) : (
                  <>
                    ↻ Refresh
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={downloadExcel}
                disabled={
                  rejected.length === 0 ||
                  downloading
                }
              >
                {downloading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>

                    Downloading...
                  </>
                ) : (
                  <>
                    📊 Download Excel
                  </>
                )}
              </button>

            </div>

          </div>

          {/* =========================
              HEADER
          ========================= */}

          <div className="rejected-header">

            <div>
              <h1>
                ❌ Rejected Candidates
              </h1>

              <p>
                Manage rejected applicants
              </p>
            </div>

            <div className="rejected-count-box">
              <span className="rejected-count-number">
                {rejected.length}
              </span>

              <span className="rejected-count-label">
                Rejected Candidates
              </span>
            </div>

          </div>

          {/* =========================
              EMPTY
          ========================= */}

          {rejected.length === 0 ? (

            <div className="rejected-empty-box">

              <h3>
                🎉 No Rejected Candidates
              </h3>

              <p>
                No rejected applications found.
              </p>

            </div>

          ) : (

            /* =========================
               CANDIDATES
            ========================= */

            rejected.map((candidate, index) => (

              <div
                key={candidate.id}
                className="rejected-card"
              >

                <div className="rejected-card-body">

                  <div className="row align-items-center">

                    {/* PROFILE IMAGE */}

                    <div className="col-lg-2 text-center mb-3 mb-lg-0">

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

                    {/* DETAILS */}

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
                        💼{" "}
                        <b>
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
                                className="badge bg-secondary me-2 mb-2"
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

                    {/* ACTIONS */}

                    <div className="col-lg-3 text-lg-end">

                      <span className="badge bg-danger fs-6 px-4 py-2">
                        ✖ Rejected
                      </span>

                      <div className="d-grid gap-2 mt-3">

                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target={`#profile${index}`}
                        >
                          👤 View Profile
                        </button>

                        {candidate.resume_path && (
                          <a
                            href={`http://localhost:5000/${candidate.resume_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-danger"
                          >
                            📄 View Resume
                          </a>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

                {/* =========================
                    PROFILE MODAL
                ========================= */}

                <div
                  className="modal fade"
                  id={`profile${index}`}
                  tabIndex="-1"
                >

                  <div className="modal-dialog modal-lg modal-dialog-centered">

                    <div className="modal-content">

                      <div className="modal-header bg-danger text-white">

                        <h5 className="modal-title">
                          Candidate Profile
                        </h5>

                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                        ></button>

                      </div>

                      <div className="modal-body p-4">

                        {/* PROFILE */}

                        <div className="text-center mb-4">

                          <img
                            src={
                              candidate.profile_image
                                ? `http://localhost:5000/${candidate.profile_image}`
                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            alt="profile"
                            width="140"
                            height="140"
                            className="rounded-circle border border-4 border-danger"
                          />

                          <h3 className="mt-3">
                            {candidate.username}
                          </h3>

                        </div>

                        {/* DETAILS */}

                        <div className="row">

                          <div className="col-md-6">

                            <p>
                              <b>Email:</b>{" "}
                              {candidate.email}
                            </p>

                            <p>
                              <b>Phone:</b>{" "}
                              {candidate.phone || "N/A"}
                            </p>

                            <p>
                              <b>State:</b>{" "}
                              {candidate.state || "N/A"}
                            </p>

                            <p>
                              <b>College:</b>{" "}
                              {candidate.college || "N/A"}
                            </p>

                            <p>
                              <b>Branch:</b>{" "}
                              {candidate.branch || "N/A"}
                            </p>

                          </div>

                          <div className="col-md-6">

                            <p>
                              <b>10th:</b>{" "}
                              {candidate.tenth || "N/A"}
                            </p>

                            <p>
                              <b>Intermediate:</b>{" "}
                              {candidate.intermediate || "N/A"}
                            </p>

                            <p>
                              <b>Degree:</b>{" "}
                              {candidate.degree || "N/A"}
                            </p>

                            <p>
                              <b>Job Title:</b>{" "}
                              {candidate.job_title || "N/A"}
                            </p>

                            <p>
                              <b>Applied Date:</b>{" "}
                              {candidate.applied_date
                                ? new Date(
                                    candidate.applied_date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>

                          </div>

                        </div>

                        <hr />

                        <h5>
                          🛠 Skills
                        </h5>

                        <p>
                          {candidate.skills ||
                            "No Skills Added"}
                        </p>

                        {/* RESUME */}

                        {candidate.resume_path && (
                          <a
                            href={`http://localhost:5000/${candidate.resume_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-danger mt-3"
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

      </div>
    </>
  );
}

export default RejectedCandidates;
