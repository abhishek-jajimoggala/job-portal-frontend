
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/SavedJobs.css";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* =========================================================
     LOGIN CHECK
  ========================================================= */

  const checkLogin = () => {
    const loggedUser =
      sessionStorage.getItem("loggedUser");

    const userId =
      sessionStorage.getItem("userId");

    if (!loggedUser || !userId) {
      return false;
    }

    return true;
  };

  /* =========================================================
     LOAD SAVED JOBS
  ========================================================= */

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    /* =========================================
       USER LOGIN CHECK
    ========================================= */

    if (!checkLogin()) {
      toast.warning("Please Login To View Saved Jobs");

      setLoading(false);

      navigate("/login");

      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/saved-jobs",
        {
          withCredentials: true,
        }
      );

      if (
        response.data.status === "success"
      ) {
        setSavedJobs(
          response.data.jobs || []
        );
      } else {
        setSavedJobs([]);

        toast.warning(
          response.data.message ||
            "Unable To Load Saved Jobs"
        );
      }
    } catch (error) {
      console.error(
        "Load Saved Jobs Error:",
        error
      );

      /* =========================================
         SESSION EXPIRED / NOT LOGGED IN
      ========================================= */

      if (
        error.response?.status === 401
      ) {
        toast.warning(
          "Please Login To View Saved Jobs"
        );

        sessionStorage.removeItem(
          "loggedUser"
        );

        sessionStorage.removeItem(
          "userId"
        );

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed To Load Saved Jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REMOVE SAVED JOB
  ========================================================= */

  const removeJob = async (savedId) => {
    /* =========================================
       LOGIN CHECK
    ========================================= */

    if (!checkLogin()) {
      toast.warning(
        "Please Login To Remove Saved Jobs"
      );

      navigate("/login");

      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/remove-saved-job/${savedId}`,
        {
          withCredentials: true,
        }
      );

      if (
        response.data.status === "success"
      ) {
        setSavedJobs((prevJobs) =>
          prevJobs.filter(
            (job) =>
              job.saved_id !== savedId
          )
        );

        toast.success(
          response.data.message ||
            "Job Removed Successfully"
        );
      } else {
        toast.error(
          response.data?.message ||
            "Failed To Remove Job"
        );
      }
    } catch (error) {
      console.error(
        "Remove Saved Job Error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        toast.warning(
          "Please Login First"
        );

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed To Remove Job"
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="saved-jobs-page">

        <div className="container">

          <div className="saved-jobs-loading">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <h5>
              Loading Saved Jobs...
            </h5>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="saved-jobs-page">

      <div className="container">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="saved-jobs-header">

          <div>

            <h2>
              ❤️ Saved Jobs
            </h2>

            <p>
              Jobs you saved for later
            </p>

          </div>

          <div className="saved-jobs-count">

            {savedJobs.length}{" "}

            {savedJobs.length === 1
              ? "Job"
              : "Jobs"}

          </div>

        </div>


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {savedJobs.length === 0 ? (

          <div className="saved-jobs-empty">

            <div className="saved-empty-icon">
              ❤️
            </div>

            <h4>
              No Saved Jobs Found
            </h4>

            <p>
              You haven't saved any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="btn btn-primary saved-browse-btn"
            >
              Browse Jobs
            </Link>

          </div>

        ) : (

          /* ===================================================
             SAVED JOBS
          =================================================== */

          <div className="row g-4">

            {savedJobs.map((job) => (

              <div
                className="col-xl-4 col-lg-4 col-md-6 col-12"
                key={job.saved_id}
              >

                <div className="card shadow-sm h-100 border-0 saved-job-card">

                  <div className="card-body">

                    {/* =========================================
                        JOB TITLE
                    ========================================= */}

                    <div className="saved-job-top">

                      <div>

                        <h5 className="saved-job-title">
                          {job.job_title}
                        </h5>

                        <h6 className="saved-job-company">
                          {job.company_name}
                        </h6>

                      </div>

                      <span className="saved-job-badge">
                        Saved
                      </span>

                    </div>


                    {/* =========================================
                        JOB DETAILS
                    ========================================= */}

                    <div className="saved-job-details">

                      <div>

                        <span className="saved-detail-icon">
                          📍
                        </span>

                        <span>
                          {job.location ||
                            "Location Not Mentioned"}
                        </span>

                      </div>

                      <div>

                        <span className="saved-detail-icon">
                          💰
                        </span>

                        <span>
                          {job.salary ||
                            "Not Mentioned"}
                        </span>

                      </div>

                      <div>

                        <span className="saved-detail-icon">
                          💼
                        </span>

                        <span>
                          {job.job_type ||
                            "Full Time"}
                        </span>

                      </div>

                      <div>

                        <span className="saved-detail-icon">
                          🏢
                        </span>

                        <span>
                          {job.experience ||
                            "Experience Not Mentioned"}
                        </span>

                      </div>

                    </div>


                    {/* =========================================
                        SKILLS
                    ========================================= */}

                    {job.skills && (

                      <div className="saved-job-skills">

                        {job.skills
                          .split(",")
                          .slice(0, 6)
                          .map(
                            (
                              skill,
                              index
                            ) => (

                              <span
                                className="saved-skill"
                                key={index}
                              >
                                {skill.trim()}
                              </span>

                            )
                          )}

                      </div>

                    )}


                    {/* =========================================
                        ACTION BUTTONS
                    ========================================= */}

                    <div className="saved-job-actions">

                      <Link
                        to={`/job/${job.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>

                      <Link
                        to={`/apply/${job.id}`}
                        className="btn btn-success"
                      >
                        Apply Now
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() =>
                          removeJob(
                            job.saved_id
                          )
                        }
                      >
                        🗑 Remove
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
  );
}

export default SavedJobs;
