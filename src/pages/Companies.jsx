
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Companies.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const companyMap = {};

          data.jobs.forEach((job) => {
            const companyName =
              job.company_name || job.company;

            if (!companyName) {
              return;
            }

            const cleanCompanyName =
              companyName.trim();

            if (companyMap[cleanCompanyName]) {
              companyMap[cleanCompanyName].openings += 1;
            } else {
              companyMap[cleanCompanyName] = {
                id:
                  Object.keys(companyMap).length + 1,

                name: cleanCompanyName,

                location:
                  job.location ||
                  "Multiple Locations",

                openings: 1,
              };
            }
          });

          setCompanies(
            Object.values(companyMap)
          );
        } else {
          setCompanies([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching companies:",
          error
        );

        setCompanies([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="companies-page">

      <div className="companies-container">

        {/* =====================================================
            PAGE TITLE
        ===================================================== */}

        <div className="companies-title-section">

          <span className="companies-title-badge">
            🏢 Career Opportunities
          </span>

          <h1>
            Explore Top Companies
          </h1>

          <p>
            Discover exciting job opportunities from
            leading companies and take the next step
            in your career.
          </p>

        </div>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="companies-header">

          <div>

            <h2>
              Top Companies Hiring
            </h2>

            <p>
              Find your dream job from companies
              currently hiring.
            </p>

          </div>

          {!loading &&
            companies.length > 0 && (

              <div className="companies-count">

                {companies.length}{" "}

                {companies.length === 1
                  ? "Company"
                  : "Companies"}

              </div>

            )}

        </div>


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="companies-message">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <p>
              Loading companies...
            </p>

          </div>

        ) : companies.length === 0 ? (

          /* ===================================================
             NO COMPANIES
          =================================================== */

          <div className="companies-message">

            <div className="companies-empty-icon">
              🏢
            </div>

            <h5>
              No Companies Found
            </h5>

            <p>
              Companies will appear here when
              admin releases jobs.
            </p>

          </div>

        ) : (

          /* ===================================================
             COMPANY CARDS
          =================================================== */

          <div className="companies-grid">

            {companies.map((company) => (

              <div
                className="company-card"
                key={company.id}
              >

                {/* Company Logo */}

                <div className="company-logo">

                  {company.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>


                {/* Company Name */}

                <h3>
                  {company.name}
                </h3>


                {/* Location */}

                <p className="company-location">

                  <span>
                    📍
                  </span>

                  {company.location}

                </p>


                {/* Openings */}

                <p className="company-openings">

                  <strong>
                    {company.openings}
                  </strong>{" "}

                  {company.openings === 1
                    ? "Open Position"
                    : "Open Positions"}

                </p>


                {/* View Jobs */}

                <Link
                  to={`/jobs?company=${encodeURIComponent(
                    company.name
                  )}`}
                  className="view-jobs-btn"
                >
                  View Jobs
                  <span>→</span>
                </Link>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Companies;
