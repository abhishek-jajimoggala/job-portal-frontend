import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";
import "./Home.css";

function Home() {
  const [searchText, setSearchText] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setJobs(data.jobs);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
const saveJob = async (job) => {
  // Check whether the user is logged in
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    toast.error("Please login first", {
      position: "top-right",
      autoClose: 3000,
    });
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/save-job",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: job.id,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.status === "success") {
      toast.success(data.message, {
        position: "top-right",
      });
    } else {
      toast.error(data.message || "Failed to save job", {
        position: "top-right",
      });
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to save job", {
      position: "top-right",
    });
  }
};
  const filteredJobs = jobs.filter((job) => {
    const search = searchText.toLowerCase();

    const skillMatch = job.skills
      ? String(job.skills)
          .toLowerCase()
          .includes(search)
      : false;

    return (
      job.job_title?.toLowerCase().includes(search) ||
      job.company_name?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search) ||
      job.description?.toLowerCase().includes(search) ||
      skillMatch
    );
  });

  const companies = [
    "TCS",
    "Infosys",
    "Wipro",
    "Accenture",
    "Cognizant",
    "Capgemini",
    "HCL",
    "Tech Mahindra",
    "Amazon",
    "Google",
    "Microsoft",
    "IBM",
    "Oracle",
    "Deloitte",
    "Zoho",
  ];

  return (
    <div className="home-page">

      <Hero
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Available Jobs */}
      <div className="container py-5">

        <h2 className="section-title">
          Available Jobs ({filteredJobs.length})
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <h4>Loading Jobs...</h4>
          </div>
        ) : (
          <div className="row g-4">

            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  saveJob={saveJob}
                />
              ))
            ) : (
              <h4 className="text-center text-danger">
                No Jobs Found
              </h4>
            )}

          </div>
        )}

      </div>

      {/* Top Companies */}
      <div className="container py-5">

        <h2 className="section-title text-center mb-4">
          Top Companies Hiring
        </h2>

        <div className="company-slider">
          <div className="company-track">

            {[...companies, ...companies].map(
              (company, index) => (
                <div
                  key={index}
                  className="company-item"
                >
                  🏢 {company}
                </div>
              )
            )}

          </div>
        </div>

      </div>

      {/* Reviews */}
      <div className="container py-5">

        <h2 className="section-title text-center">
          Candidate Reviews
        </h2>

        <div className="row g-4">

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card review-card shadow h-100 p-4">
              <h5>Rahul Kumar ⭐⭐⭐⭐⭐</h5>
              <p>
                Got placed in TCS within 15 days.
              </p>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card review-card shadow h-100 p-4">
              <h5>Priya Sharma ⭐⭐⭐⭐⭐</h5>
              <p>
                Found React Developer role quickly.
              </p>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card review-card shadow h-100 p-4">
              <h5>Arjun Reddy ⭐⭐⭐⭐</h5>
              <p>
                Got multiple interview opportunities.
              </p>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card review-card shadow h-100 p-4">
              <h5>Sneha Patel ⭐⭐⭐⭐⭐</h5>
              <p>
                Easy application process and genuine jobs.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Statistics */}
      <div className="container py-5">

        <div className="row text-center g-4">

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card shadow p-4 stat-card">
              <h2 className="text-primary">
                {jobs.length}+
              </h2>
              <h6>Active Jobs</h6>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card shadow p-4 stat-card">
              <h2 className="text-success">
                500+
              </h2>
              <h6>Companies</h6>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card shadow p-4 stat-card">
              <h2 className="text-warning">
                50K+
              </h2>
              <h6>Candidates</h6>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="card shadow p-4 stat-card">
              <h2 className="text-danger">
                95%
              </h2>
              <h6>Success Rate</h6>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Home;