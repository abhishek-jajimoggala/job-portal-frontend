import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function JobCard({ job, saveJob }) {
  const navigate = useNavigate();

  const handleApply = () => {
    const userId =
      sessionStorage.getItem("userId");

    if (!userId) {
      toast.warning("Please Login First");
      navigate("/login");
      return;
    }

    navigate(`/apply/${job.id}`);
  };

  const getDaysAgo = (date) => {
    if (!date) return "Today";

    const today = new Date();
    const posted = new Date(date);

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

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-4">
      <div className="card job-card shadow border-0 h-100">

        <div className="card-body d-flex flex-column">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h5 className="text-primary fw-bold mb-0">
              {job.company_name}
            </h5>

            <span className="badge bg-success">
              {job.type ||
                job.job_type ||
                "Full Time"}
            </span>

          </div>

          <h4 className="fw-bold mb-3">
            {job.job_title}
          </h4>

          <p className="mb-2">
            📍 {job.location}
          </p>

          <p className="mb-2">
            💰 {job.salary || "Not Disclosed"}
          </p>

          <p className="mb-2">
            🧑‍💻 {job.experience || "Fresher"}
          </p>

          <p className="text-secondary mb-3">
            🕒{" "}
            {getDaysAgo(
              job.created_at ||
                job.createdAt
            )}
          </p>

          <p className="text-muted">
            {job.description
              ? `${job.description.substring(
                  0,
                  100
                )}...`
              : "No Description Available"}
          </p>

          <div className="skills-container mb-3">

            {job.skills ? (
              (
                Array.isArray(job.skills)
                  ? job.skills
                  : String(job.skills).split(",")
              ).map((skill, index) => (
                <span
                  key={index}
                  className="badge bg-info text-dark me-2 mb-2"
                >
                  {skill.trim()}
                </span>
              ))
            ) : (
              <span className="text-muted">
                No Skills Available
              </span>
            )}

          </div>

          <div className="mt-auto d-grid gap-2">

            <Link
              to={`/job/${job.id}`}
              className="btn btn-primary"
            >
              View Details
            </Link>

            <button
              className="btn btn-success"
              onClick={handleApply}
            >
              Apply Now
            </button>

            <button
              className="btn btn-outline-success"
              onClick={() =>
                saveJob?.(job)
              }
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