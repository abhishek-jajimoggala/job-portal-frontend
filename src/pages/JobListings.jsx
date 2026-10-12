import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import JobCard from "../components/JobCard";

function JobListings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(
    searchParams.get("query") || ""
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/jobs"
      );

      const data = await response.json();

      if (data.status === "success") {
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed To Load Jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    navigate(
      `/job-listings?query=${encodeURIComponent(query)}`
    );
  };

  const saveJob = async (job) => {
  try {
    const userId = sessionStorage.getItem("userId");

    console.log("User ID:", userId);
    console.log("Job ID:", job.id);

    if (!userId) {
      toast.warning("Please Login First");
      navigate("/login");
      return;
    }

    const response = await fetch(
      "http://localhost:5000/api/save-job",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: job.id,
        }),
      }
    );

    const data = await response.json();

    console.log("Response:", data);

    if (response.ok && data.status === "success") {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed To Save Job");
  }
};  const filteredJobs = jobs.filter((job) => {
    const search = query.toLowerCase();

    return (
      job.job_title
        ?.toLowerCase()
        .includes(search) ||
      job.company_name
        ?.toLowerCase()
        .includes(search) ||
      job.location
        ?.toLowerCase()
        .includes(search) ||
      job.description
        ?.toLowerCase()
        .includes(search) ||
      job.skills
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="container my-5">
      {/* Search Section */}
      <div className="card shadow border-0 p-4 mb-4">
        <h3 className="fw-bold mb-3">
          Search Jobs
        </h3>

        <div className="row g-2">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search jobs, companies, skills..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-primary btn-lg w-100"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Job Count */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          Available Jobs
        </h3>

        <span className="badge bg-primary fs-6">
          {filteredJobs.length} Jobs
        </span>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="row">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saveJob={saveJob}
            />
          ))}
        </div>
      ) : (
        <div className="card shadow border-0 text-center p-5">
          <h4 className="text-danger">
            No Jobs Found
          </h4>

          <p className="text-muted">
            Try different keywords
          </p>
        </div>
      )}
    </div>
  );
}

export default JobListings;