
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

  // ADMIN LOGIN CHECK
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");

    if (isAdmin !== "true") {
      toast.error("Please Login As Admin");
      navigate("/admin-login");
      return;
    }

    loadRejectedCandidates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // LOAD REJECTED CANDIDATES
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

      toast.error(
        error.response?.data?.message ||
          "Failed To Load Candidates"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // REFRESH
  const handleRefresh = () => {
    loadRejectedCandidates(true);
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  // IMAGE URL
  const getImageUrl = (path) => {
    if (!path) {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    return `http://localhost:5000/${path.replace(/^\/+/, "")}`;
  };

  // DOWNLOAD EXCEL
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

      // TITLE
      worksheet.mergeCells("A1:J1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "REJECTED CANDIDATES";

      titleCell.font = {
        bold: true,
        size: 16,
        color: { argb: "FFFFFFFF" },
      };

      titleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFDC3545" },
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 30;

      // TOTAL COUNT
      worksheet.mergeCells("A2:J2");

      const countCell = worksheet.getCell("A2");

      countCell.value =
        `Total Rejected Candidates: ${rejected.length}`;

      countCell.font = {
        bold: true,
        size: 12,
      };

      countCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(2).height = 24;

      // EMPTY ROW
      worksheet.addRow([]);

      // HEADERS
      const headerRow = worksheet.addRow([
        "S.No",
        "Candidate Name",
        "Email",
        "Phone",
        "State",
        "Rejected For (Job Role)",
        "Company",
        "Skills",
        "Applied Date",
        "Status",
      ]);

      headerRow.height = 35;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          size: 11,
          color: { argb: "FFFFFFFF" },
        };

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDC3545" },
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

      // CANDIDATE DATA
      rejected.forEach((candidate, index) => {
        const row = worksheet.addRow([
          index + 1,
          candidate.username || "N/A",
          candidate.email || "N/A",
          candidate.phone || "N/A",
          candidate.state || "N/A",
          candidate.job_title || "Role Not Available",
          candidate.company_name || "N/A",
          candidate.skills || "N/A",
          formatDate(candidate.applied_date),
          candidate.status || "Rejected",
        ]);

        row.height = 30;

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

        // Highlight rejected job role
        row.getCell(6).font = {
          bold: true,
          color: { argb: "FFDC3545" },
        };
      });

      // COLUMN WIDTHS
      worksheet.columns = [
        { key: "sno", width: 8 },
        { key: "name", width: 25 },
        { key: "email", width: 32 },
        { key: "phone", width: 16 },
        { key: "state", width: 18 },
        { key: "job_title", width: 32 },
        { key: "company_name", width: 25 },
        { key: "skills", width: 40 },
        { key: "applied_date", width: 18 },
        { key: "status", width: 16 },
      ];

      // FREEZE HEADER
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 4,
        },
      ];

      // FILTER
      worksheet.autoFilter = {
        from: "A4",
        to: "J4",
      };

      // CREATE EXCEL FILE
      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;

      link.download = `Rejected_Candidates_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

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

  // LOADING
  if (loading) {
    return (
      <>
        <AdminNavbar />

        <div className="rejected-loading">
          <div
            className="spinner-border text-danger"
            role="status"
            aria-label="Loading"
          />

          <h4>Loading Rejected Candidates...</h4>
        </div>
      </>
    );
  }

  // MAIN UI
  return (
    <>
      <AdminNavbar />

      <div className="rejected-page">
        <div className="rejected-container">

          {/* TOP ACTIONS */}
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
                disabled={refreshing || downloading}
              >
                {refreshing ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Refreshing...
                  </>
                ) : (
                  <>↻ Refresh</>
                )}
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={downloadExcel}
                disabled={
                  rejected.length === 0 ||
                  downloading ||
                  refreshing
                }
              >
                {downloading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    />
                    Downloading...
                  </>
                ) : (
                  <>📊 Download Excel</>
                )}
              </button>
            </div>
          </div>

          {/* HEADER */}
          <div className="rejected-header">
            <div>
              <h1>❌ Rejected Candidates</h1>

              <p>Manage rejected applicants</p>
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

          {/* EMPTY STATE */}
          {rejected.length === 0 ? (
            <div className="rejected-empty-box">
              <h3>🎉 No Rejected Candidates</h3>

              <p>No rejected applications found.</p>
            </div>
          ) : (
            /* CANDIDATES */
            rejected.map((candidate, index) => (
              <div
                key={
                  candidate.application_id ??
                  candidate.id ??
                  `${candidate.email}-${index}`
                }
                className="rejected-card"
              >
                <div className="rejected-card-body">
                  <div className="row align-items-center">

                    {/* PROFILE IMAGE */}
                    <div className="col-lg-2 text-center mb-3 mb-lg-0">
                      <img
                        src={getImageUrl(candidate.profile_image)}
                        alt="Candidate profile"
                        className="candidate-img"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                        }}
                      />
                    </div>

                    {/* CANDIDATE DETAILS */}
                    <div className="col-lg-7">
                      <div className="candidate-number">
                        Candidate #{index + 1}
                      </div>

                      <h3 className="candidate-name">
                        {candidate.username || "N/A"}
                      </h3>

                      <p>
                        📧 {candidate.email || "N/A"}
                      </p>

                      <p>
                        📱 {candidate.phone || "N/A"}
                      </p>

                      <p>
                        📍 {candidate.state || "N/A"}
                      </p>

                      {/* REJECTED JOB ROLE */}
                      <div className="mb-3 p-3 border rounded">
                        <p className="mb-1">
                          ❌ <strong>Rejected For (Job Role)</strong>
                        </p>

                        <h5 className="text-danger fw-bold mb-1">
                          {candidate.job_title ||
                            "Role Not Available"}
                        </h5>

                        <p className="mb-0">
                          🏢 {candidate.company_name || "N/A"}
                        </p>
                      </div>

                      <p>
                        📅 Applied: {formatDate(candidate.applied_date)}
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
                          <span>No Skills Available</span>
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
                          data-bs-target={`#profile${candidate.application_id ?? candidate.id ?? index}`}
                        >
                          👤 View Profile
                        </button>

                        {candidate.resume_path && (
                          <a
                            href={getImageUrl(candidate.resume_path)}
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

                {/* PROFILE MODAL */}
                <div
                  className="modal fade"
                  id={`profile${candidate.application_id ?? candidate.id ?? index}`}
                  tabIndex="-1"
                  aria-labelledby={`profileTitle${candidate.application_id ?? candidate.id ?? index}`}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">

                      {/* MODAL HEADER */}
                      <div className="modal-header bg-danger text-white">
                        <h5
                          className="modal-title"
                          id={`profileTitle${candidate.application_id ?? candidate.id ?? index}`}
                        >
                          Candidate Profile
                        </h5>

                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>

                      {/* MODAL BODY */}
                      <div className="modal-body p-4">
                        <div className="text-center mb-4">
                          <img
                            src={getImageUrl(candidate.profile_image)}
                            alt="Candidate profile"
                            width="140"
                            height="140"
                            className="rounded-circle border border-4 border-danger"
                            style={{ objectFit: "cover" }}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                            }}
                          />

                          <h3 className="mt-3">
                            {candidate.username || "N/A"}
                          </h3>
                        </div>

                        {/* PERSONAL DETAILS */}
                        <div className="row">
                          <div className="col-md-6">
                            <p>
                              <strong>Email:</strong>{" "}
                              {candidate.email || "N/A"}
                            </p>

                            <p>
                              <strong>Phone:</strong>{" "}
                              {candidate.phone || "N/A"}
                            </p>

                            <p>
                              <strong>State:</strong>{" "}
                              {candidate.state || "N/A"}
                            </p>

                            <p>
                              <strong>College:</strong>{" "}
                              {candidate.college || "N/A"}
                            </p>

                            <p>
                              <strong>Branch:</strong>{" "}
                              {candidate.branch || "N/A"}
                            </p>
                          </div>

                          <div className="col-md-6">
                            <p>
                              <strong>10th:</strong>{" "}
                              {candidate.tenth || "N/A"}
                            </p>

                            <p>
                              <strong>Intermediate:</strong>{" "}
                              {candidate.intermediate || "N/A"}
                            </p>

                            <p>
                              <strong>Degree:</strong>{" "}
                              {candidate.degree || "N/A"}
                            </p>

                            <p>
                              <strong>Applied Date:</strong>{" "}
                              {formatDate(candidate.applied_date)}
                            </p>
                          </div>
                        </div>

                        <hr />

                        {/* JOB DETAILS */}
                        <h5>❌ Rejected Job Details</h5>

                        <div className="p-3 border rounded mb-3">
                          <p className="mb-1">
                            <strong>Rejected For (Job Role):</strong>
                          </p>

                          <h5 className="text-danger fw-bold">
                            {candidate.job_title ||
                              "Role Not Available"}
                          </h5>

                          <p className="mb-1">
                            <strong>Company:</strong>{" "}
                            {candidate.company_name || "N/A"}
                          </p>

                          <p className="mb-0">
                            <strong>Status:</strong>{" "}
                            {candidate.status || "Rejected"}
                          </p>
                        </div>

                        <hr />

                        {/* SKILLS */}
                        <h5>🛠 Skills</h5>

                        <p>
                          {candidate.skills || "No Skills Added"}
                        </p>

                        {/* RESUME */}
                        {candidate.resume_path && (
                          <a
                            href={getImageUrl(candidate.resume_path)}
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
