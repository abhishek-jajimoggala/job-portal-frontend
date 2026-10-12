
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import { toast } from "react-toastify";
import "../styles/Jobs.css";

function Jobs() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  /* =========================
     URL PARAMETERS
  ========================= */

  const keyword =
    params.get("keyword")?.toLowerCase() || "";

  const city =
    params.get("location")?.toLowerCase() || "";

  const category =
    params.get("category")?.toLowerCase() || "";

  const company =
    params.get("company")?.toLowerCase() || "";

  /* =========================
     STATES
  ========================= */

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("");

  const [experienceFilter, setExperienceFilter] =
    useState("");

  const [workModeFilter, setWorkModeFilter] =
    useState("");

  const [salaryFilter, setSalaryFilter] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const jobsPerPage = 6;

  /* =========================================================
     NORMALIZE TEXT
  ========================================================= */

  const normalizeText = (text) => {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/[._-]/g, " ")
      .replace(/\s+/g, " ");
  };

  /* =========================================================
     GET CATEGORY NAME
     
     SAME LOGIC AS CATEGORIES.JSX
  ========================================================= */

  const getCategoryName = (job) => {
    const title = normalizeText(
      job.job_title ||
        job.title ||
        job.title_name
    );

    const jobType = normalizeText(
      job.job_type ||
        job.type
    );

    /* =====================================================
       VIDEO EDITING
    ===================================================== */

    if (
      title.includes("video editor") ||
      title.includes("vedio editor") ||
      title.includes("video editing") ||
      title.includes("vedio editing")
    ) {
      return "Video Editing";
    }

    /* =====================================================
       PYTHON FULL STACK
    ===================================================== */

    if (
      title.includes("python full stack") ||
      title.includes("python fullstack")
    ) {
      return "Python Full Stack";
    }

    /* =====================================================
       PYTHON DEVELOPER
    ===================================================== */

    if (
      title.includes("python developer") ||
      title.includes("python programmer")
    ) {
      return "Python Developer";
    }

    /* =====================================================
       REACT DEVELOPER
    ===================================================== */

    if (
      title.includes("react developer") ||
      title.includes("react js developer")
    ) {
      return "React Developer";
    }

    /* =====================================================
       JAVA DEVELOPER
    ===================================================== */

    if (
      title.includes("java developer") ||
      title.includes("java programmer")
    ) {
      return "Java Developer";
    }

    /* =====================================================
       BACKEND ENGINEER
    ===================================================== */

    if (
      title.includes("backend engineer") ||
      title.includes("backend developer") ||
      title.includes("back end engineer") ||
      title.includes("back end developer")
    ) {
      return "Backend Engineer";
    }

    /* =====================================================
       DATA ANALYST
    ===================================================== */

    if (title.includes("data analyst")) {
      return "Data Analyst";
    }

    /* =====================================================
       UNIT TESTING
    ===================================================== */

    if (
      title.includes("unit testing") ||
      title.includes("unit tester") ||
      title.includes("testing engineer")
    ) {
      return "Unit Testing";
    }

    /* =====================================================
       AIML
    ===================================================== */

    if (
      title.includes("aiml") ||
      title.includes("ai ml") ||
      title.includes("ai/ml") ||
      title.includes("machine learning")
    ) {
      return "AIML";
    }

    /* =====================================================
       GEN AI
    ===================================================== */

    if (
      title.includes("gen ai") ||
      title.includes("generative ai") ||
      title.includes("prompt engineering") ||
      title.includes("prompt engineer")
    ) {
      return "Gen AI & Prompt Engineering";
    }

    /* =====================================================
       SOFTWARE DEVELOPER
    ===================================================== */

    if (
      title.includes("software developer") ||
      title.includes("software engineer")
    ) {
      return "Software Developer";
    }

    /* =====================================================
       UI / UX
    ===================================================== */

    if (
      title.includes("ui ux") ||
      title.includes("ui/ux") ||
      title.includes("ui designer") ||
      title.includes("ux designer")
    ) {
      return "UI/UX Design";
    }

    /* =====================================================
       GRAPHIC DESIGN
    ===================================================== */

    if (
      title.includes("graphic designer") ||
      title.includes("graphic design")
    ) {
      return "Graphic Design";
    }

    /* =====================================================
       DIGITAL MARKETING
    ===================================================== */

    if (
      title.includes("digital marketing") ||
      title.includes("marketing executive")
    ) {
      return "Digital Marketing";
    }

    /* =====================================================
       INTERNSHIPS
    ===================================================== */

    if (
      jobType.includes("intern") ||
      title.includes("intern") ||
      title.includes("internship") ||
      title.includes("trainee")
    ) {
      return "Internships";
    }

    /* =====================================================
       UNKNOWN TITLE
       SAME FALLBACK LOGIC
    ===================================================== */

    if (title) {
      return createTitleCategory(title);
    }

    return null;
  };

  /* =========================================================
     CREATE CATEGORY FOR UNKNOWN TITLES
  ========================================================= */

  const createTitleCategory = (title) => {
    let category = title;

    category = category
      .replace(/\b(senior|junior|lead|sr|jr)\b/g, "")
      .replace(/\b(full time|part time|remote|hybrid)\b/g, "")
      .replace(/\b(intern|internship|trainee)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!category) {
      return null;
    }

    return category
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  /* =========================================================
     FETCH JOBS
  ========================================================= */

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/jobs",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setJobs(data.jobs || []);
      } else {
        toast.error(
          data.message || "Failed to load jobs"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SAVE JOB
  ========================================================= */

  const saveJob = async (jobId) => {
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
            job_id: jobId,
          }),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        toast.success(
          data.message || "Job Saved Successfully"
        );
      } else {
        toast.warning(
          data.message || "Unable to save job"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save job");
    }
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setTypeFilter("");
    setExperienceFilter("");
    setWorkModeFilter("");
    setSalaryFilter("");
    setCurrentPage(1);
  };

  /* =========================================================
     FILTER JOBS
  ========================================================= */

  const filteredJobs = jobs.filter((job) => {
    const searchText =
      search.trim().toLowerCase();

    const title = normalizeText(
      job.job_title ||
        job.title ||
        job.title_name
    );

    const companyName =
      normalizeText(job.company_name);

    const description =
      normalizeText(job.description);

    const jobLocation =
      normalizeText(job.location);

    const skills =
      normalizeText(job.skills);

    const jobType =
      normalizeText(
        job.job_type ||
          job.type
      );

    const experience =
      normalizeText(job.experience);

    const workMode =
      normalizeText(job.work_mode);

    const salary =
      normalizeText(job.salary);

    /* =====================================================
       SEARCH
    ===================================================== */

    const searchMatch =
      searchText === "" ||
      title.includes(
        normalizeText(searchText)
      ) ||
      companyName.includes(
        normalizeText(searchText)
      ) ||
      description.includes(
        normalizeText(searchText)
      ) ||
      skills.includes(
        normalizeText(searchText)
      );

    /* =====================================================
       COMPANY FROM COMPANIES PAGE
    ===================================================== */

    const companyMatch =
      company === "" ||
      companyName.includes(
        normalizeText(company)
      );

    /* =====================================================
       URL KEYWORD
    ===================================================== */

    const keywordMatch =
      keyword === "" ||
      title.includes(
        normalizeText(keyword)
      ) ||
      companyName.includes(
        normalizeText(keyword)
      ) ||
      skills.includes(
        normalizeText(keyword)
      );

    /* =====================================================
       URL LOCATION
    ===================================================== */

    const cityMatch =
      city === "" ||
      jobLocation.includes(
        normalizeText(city)
      );

    /* =====================================================
       LOCATION FILTER
    ===================================================== */

    const locationMatch =
      locationFilter === "" ||
      jobLocation.includes(
        normalizeText(locationFilter)
      );

    /* =====================================================
       JOB TYPE
    ===================================================== */

    const typeMatch =
      typeFilter === "" ||
      jobType.includes(
        normalizeText(typeFilter)
      );

    /* =====================================================
       EXPERIENCE
    ===================================================== */

    const experienceMatch =
      experienceFilter === "" ||
      experience.includes(
        normalizeText(experienceFilter)
      );

    /* =====================================================
       WORK MODE
    ===================================================== */

    const workModeMatch =
      workModeFilter === "" ||
      workMode.includes(
        normalizeText(workModeFilter)
      );

    /* =====================================================
       SALARY
    ===================================================== */

    let salaryMatch = true;

    if (salaryFilter !== "") {
      if (salaryFilter === "0-3") {
        salaryMatch =
          salary.includes("0 3") ||
          salary.includes("0-3") ||
          salary.includes("0 - 3") ||
          salary.includes("3 lpa");
      }

      if (salaryFilter === "3-6") {
        salaryMatch =
          salary.includes("3 6") ||
          salary.includes("3-6") ||
          salary.includes("3 - 6") ||
          salary.includes("6 lpa");
      }

      if (salaryFilter === "6-10") {
        salaryMatch =
          salary.includes("6 10") ||
          salary.includes("6-10") ||
          salary.includes("6 - 10") ||
          salary.includes("10 lpa");
      }

      if (salaryFilter === "10+") {
        salaryMatch =
          salary.includes("10+") ||
          salary.includes("10 +") ||
          salary.includes("10 lpa") ||
          salary.includes("12 lpa") ||
          salary.includes("15 lpa") ||
          salary.includes("20 lpa");
      }
    }

    /* =====================================================
       CATEGORY
       
       IMPORTANT:
       Category card and Jobs page now use the SAME
       getCategoryName() logic.
    ===================================================== */

    let categoryMatch = true;

    if (category !== "") {
      const jobCategory =
        getCategoryName(job);

      categoryMatch =
        jobCategory &&
        normalizeText(jobCategory) ===
          normalizeText(category);
    }

    /* =====================================================
       FINAL RESULT
    ===================================================== */

    return (
      searchMatch &&
      companyMatch &&
      keywordMatch &&
      cityMatch &&
      locationMatch &&
      typeMatch &&
      experienceMatch &&
      workModeMatch &&
      salaryMatch &&
      categoryMatch
    );
  });

  /* =========================================================
     RESET PAGE WHEN FILTERS CHANGE
  ========================================================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    locationFilter,
    typeFilter,
    experienceFilter,
    workModeFilter,
    salaryFilter,
    company,
    category,
    keyword,
    city,
  ]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  const indexOfLastJob =
    currentPage * jobsPerPage;

  const indexOfFirstJob =
    indexOfLastJob - jobsPerPage;

  const currentJobs =
    filteredJobs.slice(
      indexOfFirstJob,
      indexOfLastJob
    );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <h4>Loading Jobs...</h4>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="container my-4 jobs-page">

      {/* =====================================================
          TITLE
      ===================================================== */}

      <div className="mb-4">

        <h2 className="fw-bold mb-1">

          {category
            ? `${category
                .charAt(0)
                .toUpperCase()}${category.slice(1)} Jobs`
            : company
            ? `${company
                .charAt(0)
                .toUpperCase()}${company.slice(1)} Jobs`
            : "Available Jobs"}

        </h2>

        <p className="text-muted mb-0">
          {filteredJobs.length} jobs found
        </p>

      </div>

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="jobs-layout">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="jobs-filter-sidebar">

          <h5 className="mb-3">
            Filters
          </h5>

          {/* LOCATION */}

          <div className="filter-group">

            <label>
              Location
            </label>

            <select
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Locations
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

              <option value="Hyderabad">
                Hyderabad
              </option>

              <option value="Chennai">
                Chennai
              </option>

              <option value="Pune">
                Pune
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

              <option value="Delhi">
                Delhi
              </option>

            </select>

          </div>

          {/* JOB TYPE */}

          <div className="filter-group">

            <label>
              Job Type
            </label>

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Types
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Contract">
                Contract
              </option>

            </select>

          </div>

          {/* EXPERIENCE */}

          <div className="filter-group">

            <label>
              Experience
            </label>

            <select
              value={experienceFilter}
              onChange={(e) =>
                setExperienceFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Experience
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="0-1">
                0-1 Years
              </option>

              <option value="1-3">
                1-3 Years
              </option>

              <option value="3-5">
                3-5 Years
              </option>

              <option value="5+">
                5+ Years
              </option>

            </select>

          </div>

          {/* WORK MODE */}

          <div className="filter-group">

            <label>
              Work Mode
            </label>

            <select
              value={workModeFilter}
              onChange={(e) =>
                setWorkModeFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Modes
              </option>

              <option value="Remote">
                Remote
              </option>

              <option value="Work From Home">
                Work From Home
              </option>

              <option value="Hybrid">
                Hybrid
              </option>

              <option value="Onsite">
                Onsite
              </option>

            </select>

          </div>

          {/* SALARY */}

          <div className="filter-group">

            <label>
              Salary
            </label>

            <select
              value={salaryFilter}
              onChange={(e) =>
                setSalaryFilter(
                  e.target.value
                )
              }
            >

              <option value="">
                All Salaries
              </option>

              <option value="0-3">
                0 - 3 LPA
              </option>

              <option value="3-6">
                3 - 6 LPA
              </option>

              <option value="6-10">
                6 - 10 LPA
              </option>

              <option value="10+">
                10+ LPA
              </option>

            </select>

          </div>

          {/* CLEAR */}

          <button
            type="button"
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </aside>

        {/* ===================================================
            JOB RESULTS
        =================================================== */}

        <section className="jobs-results">

          {/* SEARCH */}

          <input
            type="text"
            className="jobs-search"
            placeholder="Search jobs, skills or companies..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {/* JOB CARDS */}

          {currentJobs.length > 0 ? (

            <div className="jobs-grid">

              {currentJobs.map((job) => (

                <JobCard
                  key={job.id}
                  job={job}
                  saveJob={() =>
                    saveJob(job.id)
                  }
                />

              ))}

            </div>

          ) : (

            /* NO JOBS */

            <div className="no-jobs">

              <h5>
                No Jobs Found
              </h5>

              <p>
                Try changing your
                filters or search.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {totalPages > 1 && (

            <div className="jobs-pagination">

              <button
                type="button"
                className="pagination-btn"
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Previous
              </button>

              <div className="page-numbers">

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    type="button"
                    key={page}
                    className={`page-number ${
                      currentPage === page
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>

                ))}

              </div>

              <button
                type="button"
                className="pagination-btn"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </button>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default Jobs;
