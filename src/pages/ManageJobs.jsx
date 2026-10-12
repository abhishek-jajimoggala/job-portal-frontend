
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/ManageJobs.css";

function ManageJobs() { 
  const [submitting, setSubmitting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const loggedAdminId = Number(sessionStorage.getItem("admin_id"));

  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    salary: "",
    experience: "",
    job_type: "Full Time",
    skills: "",
    description: "",
  });

  // ==========================================
  // FETCH ALL JOBS
  // ==========================================
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          withCredentials: true,
        }
      );

      console.log("JOBS API RESPONSE:", res.data);

      if (res.data.status === "success") {
        setJobs(res.data.jobs || []);
      } else {
        toast.error(
          res.data.message || "Failed To Load Jobs"
        );
      }
    } catch (err) {
      console.error("FETCH JOBS ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed To Load Jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setFormData({
      job_title: "",
      company_name: "",
      location: "",
      salary: "",
      experience: "",
      job_type: "Full Time",
      skills: "",
      description: "",
    });

    setEditId(null);
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Prevent double click
  if (submitting) return;

  setSubmitting(true);

  try {
    // ======================================
    // UPDATE JOB
    // ======================================
    if (editId) {
      const res = await axios.put(
        `http://localhost:5000/api/update-job/${editId}`,
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        res.data.message || "Job Updated Successfully"
      );
    }

    // ======================================
    // ADD NEW JOB
    // ======================================
    else {
      const res = await axios.post(
        "http://localhost:5000/api/add-job",
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(
        res.data.message || "Job Added Successfully"
      );
    }

    resetForm();
    fetchJobs();

  } catch (err) {
    console.error("JOB SUBMIT ERROR:", err);

    toast.error(
      err.response?.data?.message ||
        "Operation Failed"
    );

  } finally {
    setSubmitting(false);
  }
};
      

  // ==========================================
  // EDIT JOB
  // ==========================================
  const handleEdit = (job) => {
    console.log("EDIT JOB:", job);

    setEditId(job.id);

    setFormData({
      job_title: job.job_title || "",
      company_name: job.company_name || "",
      location: job.location || "",
      salary: job.salary || "",
      experience: job.experience || "",
      job_type: job.job_type || "Full Time",
      skills: job.skills || "",
      description: job.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE JOB
  // ==========================================
  const handleDelete = async (job) => {
    console.log("DELETE JOB:", job);

    if (
      !window.confirm(
        "Are you sure you want to delete this job?"
      )
    ) {
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/jobs/${job.id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(
        res.data.message ||
          "Job Deleted Successfully"
      );

      fetchJobs();
    } catch (err) {
      console.error(
        "DELETE JOB ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed To Delete Job"
      );
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="manage-jobs-page">

        {/* =====================================
            PAGE HEADER
        ===================================== */}

        <div className="manage-jobs-header">

          <div className="manage-jobs-heading">

            <h1>
              Manage Jobs
            </h1>

            <p>
              Add, edit and manage all posted jobs
            </p>

          </div>

          <Link
            to="/admin"
            className="dashboard-btn"
          >
            ← Dashboard
          </Link>

        </div>

        <div className="manage-jobs-container">

          {/* =====================================
              ADD / EDIT JOB
          ===================================== */}

          <div className="card shadow-lg border-0 job-form-card">

            <div className="card-body p-4">

              <div className="form-heading">

                <h2>
                  {editId
                    ? "Edit Job"
                    : "Add New Job"}
                </h2>

                <p>
                  {editId
                    ? "Update the selected job details"
                    : "Create a new job posting"}
                </p>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="row">

                  {/* JOB TITLE */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Job Title
                    </label>

                    <input
                      type="text"
                      name="job_title"
                      className="form-control"
                      placeholder="Enter job title"
                      value={
                        formData.job_title
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* COMPANY */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Company Name
                    </label>

                    <input
                      type="text"
                      name="company_name"
                      className="form-control"
                      placeholder="Enter company name"
                      value={
                        formData.company_name
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* LOCATION */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      placeholder="Enter location"
                      value={
                        formData.location
                      }
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* SALARY */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Salary
                    </label>

                    <input
                      type="text"
                      name="salary"
                      className="form-control"
                      placeholder="Example: ₹5 - ₹8 LPA"
                      value={
                        formData.salary
                      }
                      onChange={handleChange}
                    />

                  </div>

                  {/* EXPERIENCE */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Experience
                    </label>

                    <input
                      type="text"
                      name="experience"
                      className="form-control"
                      placeholder="Example: 0 - 2 Years"
                      value={
                        formData.experience
                      }
                      onChange={handleChange}
                    />

                  </div>

                  {/* JOB TYPE */}
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Job Type
                    </label>

                    <select
                      name="job_type"
                      className="form-select"
                      value={
                        formData.job_type
                      }
                      onChange={handleChange}
                    >

                      <option value="Full Time">
                        Full Time
                      </option>

                      <option value="Part Time">
                        Part Time
                      </option>

                      <option value="Remote">
                        Remote
                      </option>

                      <option value="Internship">
                        Internship
                      </option>

                    </select>

                  </div>

                  {/* SKILLS */}
                  <div className="col-12 mb-3">

                    <label className="form-label">
                      Skills
                    </label>

                    <input
                      type="text"
                      name="skills"
                      className="form-control"
                      placeholder="Example: React, Python, SQL, Flask"
                      value={
                        formData.skills
                      }
                      onChange={handleChange}
                    />

                  </div>

                  {/* DESCRIPTION */}
                  <div className="col-12 mb-3">

                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      name="description"
                      className="form-control"
                      rows="5"
                      placeholder="Enter job description"
                      value={
                        formData.description
                      }
                      onChange={handleChange}
                    />

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="d-flex gap-2">

                                      <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={submitting}
                    >
                      {submitting
                        ? editId
                          ? "Updating..."
                          : "Adding..."
                        : editId
                          ? "Update Job"
                          : "Add Job"}
                    </button>

                  {editId && (
                    <button
                      type="button"
                      className="btn btn-secondary px-4"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>

            </div>

          </div>

          {/* =====================================
              ALL JOBS HEADER
          ===================================== */}

          <div className="posted-jobs-heading">

            <div>

              <h2>
                All Posted Jobs
              </h2>

              <p>
                {jobs.length} jobs available
              </p>

            </div>

            <button
              type="button"
              className="refresh-jobs-btn"
              onClick={fetchJobs}
            >
              ↻ Refresh
            </button>

          </div>

          {/* =====================================
              ALL JOBS
          ===================================== */}

          {loading ? (

            <div className="loading-box">
              <h4>
                Loading Jobs...
              </h4>
            </div>

          ) : jobs.length === 0 ? (

            <div className="no-jobs-box">
              <h4>
                No Jobs Found
              </h4>

              <p>
                Add your first job using the form above.
              </p>
            </div>

          ) : (

            <div className="row g-4">

              {jobs.map((job) => (

                <div
                  key={job.id}
                  className="col-xl-4 col-lg-6 col-md-6"
                >

                  <div className="card job-card shadow-sm h-100">

                    <div className="card-body">

                      {/* JOB TITLE */}

                      <div className="job-card-top">

                        <div>

                          <h5 className="job-card-title">
                            {job.job_title}
                          </h5>

                          <p className="job-company">
                            {job.company_name}
                          </p>

                        </div>

                        <span className="job-id">
                          #{job.id}
                        </span>

                      </div>

                      <hr />

                      {/* DETAILS */}

                      <div className="job-details">

                        <p>
                          <strong>
                            📍 Location:
                          </strong>{" "}
                          {job.location || "N/A"}
                        </p>

                        <p>
                          <strong>
                            💰 Salary:
                          </strong>{" "}
                          {job.salary || "N/A"}
                        </p>

                        <p>
                          <strong>
                            💼 Experience:
                          </strong>{" "}
                          {job.experience || "N/A"}
                        </p>

                        <p>
                          <strong>
                            🕒 Job Type:
                          </strong>{" "}
                          {job.job_type || "N/A"}
                        </p>

                        <p>
                          <strong>
                            👤 Posted By Admin ID:
                          </strong>{" "}
                          {job.admin_id || "N/A"}
                        </p>

                      </div>

                      {/* SKILLS */}

                      {job.skills && (
                        <div className="job-skills">

                          {String(job.skills)
                            .split(",")
                            .map(
                              (skill, index) => (
                                <span
                                  key={index}
                                  className="skill-badge"
                                >
                                  {skill.trim()}
                                </span>
                              )
                            )}

                        </div>
                      )}

                      {/* DESCRIPTION */}

                      {job.description && (
                        <p className="job-description">

                          {job.description.length > 120
                            ? `${job.description.substring(
                                0,
                                120
                              )}...`
                            : job.description}

                        </p>
                      )}

                      {/* ACTION BUTTONS */}
{/* ACTION BUTTONS */}

<div className="job-actions">

  <button
    type="button"
    className="btn btn-warning btn-sm"
    onClick={() => handleEdit(job)}
    disabled={Number(job.admin_id) !== loggedAdminId}
    title={
      Number(job.admin_id) !== loggedAdminId
        ? "You cannot edit another admin's job"
        : "Edit Job"
    }
  >
    ✏️ Edit
  </button>

  <button
    type="button"
    className="btn btn-danger btn-sm"
    onClick={() => handleDelete(job)}
    disabled={Number(job.admin_id) !== loggedAdminId}
    title={
      Number(job.admin_id) !== loggedAdminId
        ? "You cannot delete another admin's job"
        : "Delete Job"
    }
  >
    🗑️ Delete
  </button>

</div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default ManageJobs;
