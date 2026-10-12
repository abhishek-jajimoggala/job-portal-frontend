import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero({
  searchText,
  setSearchText,
}) {
  const navigate = useNavigate();

  const handleSearch = () => {
    const keyword = searchText.trim();

    if (!keyword) {
      navigate("/jobs");
      return;
    }

    navigate(
      `/jobs?keyword=${encodeURIComponent(
        keyword
      )}`
    );
  };

  return (
    <section className="hero-section">
      <div className="container text-center">

        <h1 className="hero-title">
          Find Your Dream Job Today
        </h1>

        <p className="hero-subtitle">
          10,000+ Jobs • Top Companies • Easy Apply
        </p>

        {/* Search Box */}
        <div className="search-box">

          <div className="search-field">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              value={searchText}
              onChange={(e) =>
                setSearchText(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSearch();
                }
              }}
            />
          </div>

          <button
            className="search-btn"
            onClick={
              handleSearch
            }
          >
            Search
          </button>

        </div>

        {/* Popular Searches */}
        <div className="mt-4">

          <span
            className="badge bg-light text-dark me-2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/jobs?keyword=React Developer"
              )
            }
          >
            React Developer
          </span>

          <span
            className="badge bg-light text-dark me-2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/jobs?keyword=Python Developer"
              )
            }
          >
            Python Developer
          </span>

          <span
            className="badge bg-light text-dark me-2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/jobs?keyword=Java Developer"
              )
            }
          >
            Java Developer
          </span>

          <span
            className="badge bg-light text-dark me-2"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/jobs?keyword=Data Analyst"
              )
            }
          >
            Data Analyst
          </span>

          <span
            className="badge bg-light text-dark"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(
                "/jobs?keyword=Full Stack Developer"
              )
            }
          >
            Full Stack Developer
          </span>

        </div>

        {/* Stats */}
        <div className="hero-stats">

          <div className="stat-card">
            <h3>10K+</h3>
            <p>Jobs</p>
          </div>

          <div className="stat-card">
            <h3>500+</h3>
            <p>Companies</p>
          </div>

          <div className="stat-card">
            <h3>50K+</h3>
            <p>Candidates</p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
