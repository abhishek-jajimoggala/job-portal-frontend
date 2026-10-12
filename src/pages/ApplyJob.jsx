
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [resumePath, setResumePath] = useState("");

  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] =
    useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  // ==========================================
  // LOAD JOB + USER + APPLICATION STATUS
  // ==========================================

  const loadData = async () => {
    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        toast.warning("Please Login First");
        navigate("/login");
        return;
      }

      // ==========================================
      // LOAD JOB
      // ==========================================

      const jobRes = await fetch(
        `http://localhost:5000/api/job/${id}`
      );

      const jobData = await jobRes.json();

      if (jobData.status === "success") {
        setJob(jobData.job);
      } else {
        toast.error("Job Not Found");
        navigate("/jobs");
        return;
      }

      // ==========================================
      // LOAD USER PROFILE
      // ==========================================

      const profileRes = await fetch(
        `http://localhost:5000/api/profile/${userId}`
      );

      const profileData = await profileRes.json();

      console.log("PROFILE =", profileData);

      if (profileData.success) {
        setUser(profileData.user);

        setResumePath(
          profileData.user.resume_path || ""
        );

        // ==========================================
        // PROFILE COMPLETION CHECK
        // ==========================================

        if (
          !profileData.user.phone ||
          !profileData.user.degree
        ) {
          toast.warning(
            "Please Complete Your Profile First"
          );

          navigate("/profile");
          return;
        }
      } else {
        toast.error("Profile Not Found");
        return;
      }

      // ==========================================
      // CHECK ALREADY APPLIED
      // ==========================================

      await checkAlreadyApplied(
        Number(userId),
        Number(id)
      );

    } catch (error) {
      console.log("LOAD DATA ERROR:", error);
      toast.error("Failed To Load Data");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK APPLICATION STATUS
  // ==========================================

  const checkAlreadyApplied = async (
    userId,
    jobId
  ) => {
    try {
      setCheckingApplication(true);

      const response = await fetch(
        `http://localhost:5000/api/check-application/${userId}/${jobId}`
      );

      const data = await response.json();

      console.log("APPLICATION CHECK =", data);

      if (
        response.ok &&
        data.status === "success"
      ) {
        setAlreadyApplied(
          data.already_applied === true
        );
      } else {
        setAlreadyApplied(false);
      }

    } catch (error) {
      console.log(
        "CHECK APPLICATION ERROR:",
        error
      );

      setAlreadyApplied(false);

    } finally {
      setCheckingApplication(false);
    }
  };

  // ==========================================
  // APPLY JOB
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ==========================================
    // ALREADY APPLIED CHECK
    // ==========================================

    if (alreadyApplied) {
      toast.info(
        "You have already applied for this job"
      );
      return;
    }

    // ==========================================
    // SUBMITTING CHECK
    // ==========================================

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const userId =
        sessionStorage.getItem("userId");

      if (!userId) {
        toast.warning("Please Login First");
        navigate("/login");
        return;
      }

      // ==========================================
      // RESUME CHECK
      // ==========================================

      if (!resumePath) {
        toast.warning(
          "Please Upload Resume In Profile"
        );
        return;
      }

      // ==========================================
      // APPLY API
      // ==========================================

      const response = await fetch(
        "http://localhost:5000/api/apply-job",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: Number(userId),
            job_id: Number(id),
            resume: resumePath,
          }),
        }
      );

      const data = await response.json();

      console.log("APPLY RESPONSE =", data);

      // ==========================================
      // SUCCESS
      // ==========================================

      if (
        response.ok &&
        data.status === "success"
      ) {
        setAlreadyApplied(true);

        toast.success(
          "Job Applied Successfully"
        );

        navigate("/my-applications");

      } else {

        // If backend says already applied
        if (
          data.message
            ?.toLowerCase()
            .includes("already")
        ) {
          setAlreadyApplied(true);

          toast.info(
            "You have already applied for this job"
          );

          return;
        }

        toast.error(
          data.message || "Apply Failed"
        );
      }

    } catch (error) {

      console.log("APPLY ERROR:", error);

      toast.error("Server Error");

    } finally {

      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  // ==========================================
  // JOB NOT FOUND
  // ==========================================

  if (!job) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-danger">
          Job Not Found
        </h3>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container my-5">

      <div className="card shadow border-0">

        <div className="card-body p-4">

          {/* =====================================
              JOB DETAILS
          ===================================== */}

          <h2 className="fw-bold mb-3">
            Apply For {job.job_title}
          </h2>

          <h5 className="text-primary mb-3">
            {job.company_name}
          </h5>

          <p>
            <strong>Location:</strong>{" "}
            {job.location}
          </p>

          <p>
            <strong>Salary:</strong>{" "}
            {job.salary}
          </p>

          <p>
            <strong>Experience:</strong>{" "}
            {job.experience}
          </p>

          <hr />

          {/* =====================================
              ALREADY APPLIED MESSAGE
          ===================================== */}

          {alreadyApplied && (
            <div className="alert alert-success text-center fw-semibold">
              ✓ You have already applied for this job.
            </div>
          )}

          {/* =====================================
              APPLICATION FORM
          ===================================== */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="mb-3">

              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                value={
                  user?.username || ""
                }
                readOnly
              />

            </div>

            {/* EMAIL */}

            <div className="mb-3">

              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={
                  user?.email || ""
                }
                readOnly
              />

            </div>

            {/* PHONE */}

            <div className="mb-3">

              <label className="form-label">
                Phone
              </label>

              <input
                type="text"
                className="form-control"
                value={
                  user?.phone || ""
                }
                readOnly
              />

            </div>

            {/* RESUME */}

            <div className="mb-3">

              <label className="form-label">
                Resume
              </label>

              <input
                type="text"
                className="form-control"
                value={resumePath}
                readOnly
              />

            </div>

            {/* =====================================
                APPLY BUTTON
            ===================================== */}

            <button
              type="submit"
              className={`btn w-100 ${
                alreadyApplied
                  ? "btn-secondary"
                  : "btn-success"
              }`}
              disabled={
                alreadyApplied ||
                checkingApplication ||
                submitting
              }
            >

              {checkingApplication
                ? "Checking Application..."
                : alreadyApplied
                ? "✓ Already Applied"
                : submitting
                ? "Applying..."
                : "Apply Now"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ApplyJob;
