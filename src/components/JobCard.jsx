
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function JobCard({ job, saveJob }) {
  const navigate = useNavigate();

  // Apply Job
  const handleApply = () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      toast.warning("Please Login First", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/login");
      return;
    }

    navigate(`/apply/${job.id}`);
  };

  // Save Job
  const handleSave = () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
      toast.warning("Please Login First", {
        position: "top-right",
        autoClose: 3000,
      });

      return;
    }

    saveJob?.(job);
  };

  // Calculate Job Posted Date
  const getDaysAgo = (date) => {
    if (!date) return "Today";

    const today = new Date();
    const posted = new Date(date);

    if (Number.isNaN(posted.getTime())) {
      return "Today";
    }

    const diffTime = today - posted;

    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 0) return "Today";

    if (diffDays === 1) {
      return "1 Day Ago";
    }

    return `${diffDays} Days Ago`;
  };

  // Prepare Skills
  const skills = job.skills
    ? Array.isArray(job.skills)
      ? job.skills
      : String(job.skills).split(",")
    : [];

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-4">
      <div className="card job-card shadow border-0 h-100">
        <div className="card-body d-flex flex-column">

          {/* Company Name and Job Type */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-primary fw-bold mb-0">
              {job.company_name}
            </h5>

            <span className="badge bg-success">
              {job.type || job.job_type || "Full Time"}
            </span>
          </div>

          {/* Job Title */}
          <h4 className="fw-bold mb-3">
            {job.job_title}
          </h4>

          {/* Job Information */}
          <p className="mb-2">
            📍 {job.location || "Location Not Specified"}
          </p>

          <p className="mb-2">
            💰 {job.salary || "Not Disclosed"}
          </p>

          <p className="mb-2">
            🧑‍💻 {job.experience || "Fresher"}
          </p>

          <p className="text-secondary mb-3">
            🕒 {getDaysAgo(job.created_at || job.createdAt)}
          </p>

          {/* Job Description */}
          <p className="text-muted">
            {job.description
              ? job.description.length > 100
                ? `${job.description.substring(0, 100)}...`
                : job.description
              : "No Description Available"}
          </p>

          {/* Required Skills */}
          <div className="skills-container mb-3">
            {skills.length > 0 ? (
              skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-info text-dark me-2 mb-2"
                >
                  {String(skill).trim()}
                </span>
              ))
            ) : (
              <span className="text-muted">
                No Skills Available
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto d-grid gap-2">

            {/* View Details */}
            <Link
              to={`/job/${job.id}`}
              className="btn btn-primary"
            >
              View Details
            </Link>

            {/* Apply Now */}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleApply}
            >
              Apply Now
            </button>

            {/* Save Job */}
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleSave}
            >
              Save Job
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
