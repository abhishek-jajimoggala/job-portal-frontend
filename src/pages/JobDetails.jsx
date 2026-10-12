import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedUser = JSON.parse(
    localStorage.getItem("loggedUser")
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const selectedJob = data.jobs.find(
            (item) =>
              String(item.id) === String(id)
          );

          setJob(selectedJob);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load job");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const saveJob = () => {
    if (!loggedUser) {
      toast.warning("Please Login First");
      return;
    }

    const key = `savedJobs_${loggedUser.email}`;

    const savedJobs =
      JSON.parse(localStorage.getItem(key)) || [];

    const alreadySaved = savedJobs.find(
      (item) =>
        String(item.id) === String(job.id)
    );

    if (alreadySaved) {
      toast.info("Job Already Saved");
      return;
    }

    savedJobs.push(job);

    localStorage.setItem(
      key,
      JSON.stringify(savedJobs)
    );

    toast.success("Job Saved Successfully");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mt-5">
        <h2 className="text-center text-danger">
          Job Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow border-0">
        <div className="card-body p-4">

          <h2 className="fw-bold">
            {job.job_title}
          </h2>

          <h5 className="text-primary mb-3">
            {job.company}
          </h5>

          <hr />

          <div className="row">

            <div className="col-md-6">
              <p>
                <strong>📍 Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>💰 Salary:</strong>{" "}
                {job.salary}
              </p>

              <p>
                <strong>🧑‍💻 Experience:</strong>{" "}
                {job.experience}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <strong>💼 Job Type:</strong>{" "}
                {job.job_type || "Full Time"}
              </p>

              <p>
                <strong>🏢 Company:</strong>{" "}
                {job.company_name}
              </p>

              <p>
                <strong>📅 Posted:</strong>{" "}
                {job.created_at
                  ? new Date(
                      job.created_at
                    ).toLocaleDateString()
                  : "Recently"}
              </p>
            </div>

          </div>

          <hr />

          <h4 className="mb-3">
            Job Description
          </h4>

          <p className="text-muted">
            {job.description}
          </p>

          <hr />

          <h4 className="mb-3">
            Required Skills
          </h4>

          <div className="mb-4">

            {job.skills ? (
              String(job.skills)
                .split(",")
                .map((skill, index) => (
                  <span
                    key={index}
                    className="badge bg-primary me-2 mb-2"
                  >
                    {skill.trim()}
                  </span>
                ))
            ) : (
              <span className="text-muted">
                No Skills Mentioned
              </span>
            )}

          </div>

          <div className="d-flex gap-2 flex-wrap">

            <button
              className="btn btn-warning"
              onClick={saveJob}
            >
              ❤️ Save Job
            </button>

            <Link
              to={`/apply/${job.id}`}
              className="btn btn-success"
            >
              Apply Now
            </Link>

            <Link
              to="/jobs"
              className="btn btn-dark"
            >
              ← Back to Jobs
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetails;