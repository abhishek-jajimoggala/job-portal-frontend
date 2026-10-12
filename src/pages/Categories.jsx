import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  /* =========================================================
     LOAD JOBS
  ========================================================= */

  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/jobs"
      );

      const data = await response.json();

      console.log("Jobs API Response:", data);

      if (data.status === "success") {
        const jobs = data.jobs || [];

        console.log("Jobs:", jobs);

        createDynamicCategories(jobs);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Categories Error:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     NORMALIZE TITLE
  ========================================================= */

  const normalizeTitle = (title) => {
    return String(title || "")
      .toLowerCase()
      .trim()
      .replace(/[._-]/g, " ")
      .replace(/\s+/g, " ");
  };

  /* =========================================================
     GET CATEGORY FROM JOB TITLE
  ========================================================= */

  const getCategoryName = (job) => {
    const title = normalizeTitle(
      job.job_title ||
        job.title ||
        job.title_name
    );

    const jobType = normalizeTitle(
      job.job_type ||
        job.type
    );

    /* =====================================================
       VIDEO EDITING
       Vedio Editor + Video Editor + Video Editing
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
       BACKEND
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
       UI UX
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
       INTERNSHIP
       Job Type OR Title
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
       
       If title doesn't match any predefined category,
       create category automatically from title.
    ===================================================== */

    if (title) {
      return createTitleCategory(title);
    }

    return null;
  };

  /* =========================================================
     CREATE CATEGORY FROM UNKNOWN JOB TITLE
  ========================================================= */

  const createTitleCategory = (title) => {
    let category = title;

    /*
      Remove common job-level words
    */

    category = category
      .replace(/\b(senior|junior|lead|sr|jr)\b/g, "")
      .replace(/\b(full time|part time|remote|hybrid)\b/g, "")
      .replace(/\b(intern|internship|trainee)\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!category) {
      return null;
    }

    /*
      Capitalize each word
    */

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
     GET ICON
  ========================================================= */

  const getCategoryIcon = (categoryName) => {
    const icons = {
      "Video Editing": "🎬",
      "Python Full Stack": "🚀",
      "Python Developer": "🐍",
      "React Developer": "⚛️",
      "Java Developer": "☕",
      "Backend Engineer": "⚙️",
      "Data Analyst": "📊",
      "Unit Testing": "🧪",
      AIML: "🤖",
      "Gen AI & Prompt Engineering": "🧠",
      "Software Developer": "💻",
      "UI/UX Design": "🎨",
      "Graphic Design": "🖌️",
      "Digital Marketing": "📢",
      Internships: "🎓",
    };

    return icons[categoryName] || "💼";
  };

  /* =========================================================
     CREATE DYNAMIC CATEGORIES
  ========================================================= */

  const createDynamicCategories = (jobs) => {
    const categoryMap = {};

    jobs.forEach((job) => {
      const categoryName = getCategoryName(job);

      if (!categoryName) {
        return;
      }

      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          name: categoryName,
          jobs: 0,
          icon: getCategoryIcon(categoryName),
        };
      }

      categoryMap[categoryName].jobs += 1;
    });

    const dynamicCategories =
      Object.values(categoryMap);

    console.log(
      "Dynamic Categories:",
      dynamicCategories
    );

    setCategories(dynamicCategories);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="categories-page">

      <div className="categories-container">

        {/* =================================================
            TITLE
        ================================================= */}

        <div className="categories-title-section">

          <span className="categories-title-badge">
            💼 Career Opportunities
          </span>

          <h1>
            Browse Job Categories
          </h1>

          <p>
            Explore the latest job opportunities
            based on available jobs.
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="categories-message">

            <div
              className="spinner-border text-primary"
              role="status"
            ></div>

            <p>
              Loading job categories...
            </p>

          </div>

        ) : categories.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="categories-message">

            <div className="categories-empty-icon">
              📂
            </div>

            <h5>
              No Job Categories Found
            </h5>

            <p>
              Categories will appear when
              admin adds jobs.
            </p>

          </div>

        ) : (

          /* =================================================
             CATEGORY CARDS
          ================================================= */

          <div className="categories-grid">

            {categories.map((category) => (

              <div
                key={category.name}
                className="category-card"
              >

                {/* ICON */}

                <div className="category-icon">
                  {category.icon}
                </div>

                {/* TITLE */}

                <h3>
                  {category.name}
                </h3>

                {/* COUNT */}

                <p className="category-job-count">

                  <strong>
                    {category.jobs}
                  </strong>{" "}

                  {category.jobs === 1
                    ? "Job Available"
                    : "Jobs Available"}

                </p>

                {/* EXPLORE */}

                <Link
                  to={`/jobs?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="category-explore-btn"
                >

                  Explore Jobs

                  <span>
                    →
                  </span>

                </Link>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Categories;