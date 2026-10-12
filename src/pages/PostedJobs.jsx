
import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ExcelJS from "exceljs";
import "./PostedJobs.css";

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // ADMIN CHECK
  // =========================
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");

    if (isAdmin !== "true") {
      toast.error("Please Login As Admin");
      navigate("/admin-login");
      return;
    }

    fetchJobs();
  }, [navigate]);

  // =========================
  // FETCH JOBS
  // =========================
  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        "http://localhost:5000/api/jobs"
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setJobs(data.jobs || []);

        if (isRefresh) {
          toast.success("Jobs Refreshed Successfully");
        }
      } else {
        toast.error(
          data.message || "Failed to fetch jobs"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const handleRefresh = () => {
    fetchJobs(true);
  };

  // =========================
  // DOWNLOAD EXCEL
  // =========================
  const downloadExcel = async () => {
    if (jobs.length === 0) {
      toast.info("No Jobs Available To Download");
      return;
    }

    try {
      setDownloading(true);

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "Job Portal";
      workbook.created = new Date();

      const worksheet =
        workbook.addWorksheet("Posted Jobs");

      // =========================
      // TITLE
      // =========================
      worksheet.mergeCells("A1:J1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "JOB PORTAL - POSTED JOBS";

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
      worksheet.mergeCells("A2:J2");

      const countCell = worksheet.getCell("A2");

      countCell.value = `Total Posted Jobs: ${jobs.length}`;

      countCell.font = {
        bold: true,
        size: 12,
      };

      countCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(2).height = 22;

      // =========================
      // HEADERS
      // =========================
      worksheet.getRow(4).values = [
        "S.No",
        "Job ID",
        "Job Title",
        "Company Name",
        "Location",
        "Salary",
        "Experience",
        "Job Type",
        "Skills",
        "Description",
      ];

      worksheet.getRow(4).font = {
        bold: true,
        size: 11,
      };

      worksheet.getRow(4).alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      worksheet.getRow(4).height = 25;

      // =========================
      // JOB DATA
      // =========================
      jobs.forEach((job, index) => {
        worksheet.addRow([
          index + 1,
          job.id || "",
          job.title_name || job.job_title || "",
          job.company_name || "",
          job.location || "",
          job.salary || "",
          job.experience || "",
          job.type || job.job_type || "",
          job.skills || "",
          job.description || "",
        ]);
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
          key: "id",
          width: 10,
        },
        {
          key: "title",
          width: 30,
        },
        {
          key: "company",
          width: 25,
        },
        {
          key: "location",
          width: 20,
        },
        {
          key: "salary",
          width: 20,
        },
        {
          key: "experience",
          width: 18,
        },
        {
          key: "type",
          width: 18,
        },
        {
          key: "skills",
          width: 35,
        },
        {
          key: "description",
          width: 55,
        },
      ];

      // =========================
      // WRAP TEXT
      // =========================
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 4) {
          row.eachCell((cell) => {
            cell.alignment = {
              vertical: "top",
              wrapText: true,
            };
          });
        }
      });

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
        to: "J4",
      };

      // =========================
      // DOWNLOAD
      // =========================
      const buffer =
        await workbook.xlsx.writeBuffer();

      const blob = new Blob(
        [buffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const today =
        new Date().toISOString().split("T")[0];

      link.download =
        `Posted_Jobs_${today}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Excel Downloaded Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed To Download Excel");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="posted-jobs-page">

        {/* =========================
            TOP ACTIONS
        ========================= */}
        <div className="posted-jobs-top-actions">

          <Link
            to="/admin"
            className="btn btn-dark posted-dashboard-btn"
          >
            ← Dashboard
          </Link>

          <div className="posted-action-buttons">

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  🔄 Refresh
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={downloadExcel}
              disabled={downloading || jobs.length === 0}
            >
              {downloading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
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
        <div className="posted-jobs-header">

          <div>
            <h1>💼 Posted Jobs</h1>

            <p>
              View all jobs posted by admin
            </p>
          </div>

          {/* TOTAL COUNT */}
          <div className="posted-jobs-count-box">
            <span className="posted-jobs-count">
              {jobs.length}
            </span>

            <span className="posted-jobs-count-label">
              Total Posted Jobs
            </span>
          </div>

        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (

          <div className="posted-jobs-loading">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <h4>
              Loading Jobs...
            </h4>

          </div>

        ) : jobs.length === 0 ? (

          /* =========================
             NO JOBS
          ========================= */
          <div className="card shadow border-0 posted-no-jobs-card">

            <div className="card-body text-center p-5">

              <h4 className="text-muted">
                No Jobs Posted Yet
              </h4>

              <Link
                to="/admin/jobs"
                className="btn btn-primary mt-3"
              >
                Add First Job
              </Link>

            </div>

          </div>

        ) : (

          /* =========================
             JOB CARDS
          ========================= */
          <div className="row g-4">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="col-lg-4 col-md-6"
              >

                <div className="card shadow h-100 border-0 posted-job-card">

                  <div className="card-body">

                    <div className="d-flex justify-content-between mb-2">

                      <h5 className="fw-bold posted-job-title">
                        {job.title_name ||
                          job.job_title ||
                          "Untitled Job"}
                      </h5>

                      <span className="badge bg-success posted-job-type">
                        {job.type ||
                          job.job_type ||
                          "N/A"}
                      </span>

                    </div>

                    <h6 className="text-primary">
                      {job.company_name ||
                        "Company Not Available"}
                    </h6>

                    <p className="mb-2">
                      📍 {job.location || "N/A"}
                    </p>

                    <p className="mb-2">
                      💰 {job.salary || "N/A"}
                    </p>

                    <p className="mb-2">
                      🧑‍💻 {job.experience || "N/A"}
                    </p>

                    <p>
                      <strong>Skills:</strong>
                    </p>

                    <div className="mb-3">

                      {job.skills ? (
                        job.skills
                          .split(",")
                          .map((skill, index) => (

                            <span
                              key={index}
                              className="badge bg-info text-dark me-1 mb-1"
                            >
                              {skill.trim()}
                            </span>

                          ))
                      ) : (
                        <span className="text-muted">
                          No Skills
                        </span>
                      )}

                    </div>

                    <p className="text-muted posted-job-description">
                      {job.description ||
                        "No Description"}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </>
  );
}

export default PostedJobs;
