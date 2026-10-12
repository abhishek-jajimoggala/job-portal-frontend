import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  /* =========================================================
     SESSION DATA
  ========================================================= */

  const loggedUser = JSON.parse(
    sessionStorage.getItem("loggedUser") || "null"
  );


  /* =========================================================
     CLOSE MENU + DROPDOWN
  ========================================================= */

  const closeAll = () => {
    setMenuOpen(false);
    setShowDropdown(false);
  };


  /* =========================================================
     MOBILE MENU TOGGLE
  ========================================================= */

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
    setShowDropdown(false);
  };


  /* =========================================================
     CLOSE MENU WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);


  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("jobUser");

    setMenuOpen(false);
    setShowDropdown(false);

    navigate("/");

    window.location.reload();
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">

      <div className="container-fluid px-4">

        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="navbar-brand fw-bold"
          onClick={closeAll}
        >
          💼 JobPortal
        </Link>


        {/* =====================================================
            MOBILE 3 BARS
        ===================================================== */}

        <button
          type="button"
          className="navbar-toggler"
          onClick={handleMenuToggle}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* =====================================================
            NAVIGATION AREA
        ===================================================== */}

        <div
          id="navbarNav"
          className={`custom-navbar-collapse ${
            menuOpen ? "mobile-menu-open" : ""
          }`}
        >

          {/* ===================================================
              MAIN NAVIGATION LINKS
          =================================================== */}

          <ul className="navbar-nav">

            {/* HOME */}

            <li className="nav-item">
              <Link
                to="/"
                className="nav-link"
                onClick={closeAll}
              >
                Home
              </Link>
            </li>


            {/* JOBS */}

            <li className="nav-item">
              <Link
                to="/jobs"
                className="nav-link"
                onClick={closeAll}
              >
                Jobs
              </Link>
            </li>


            {/* CATEGORIES */}

            <li className="nav-item">
              <Link
                to="/categories"
                className="nav-link"
                onClick={closeAll}
              >
                Categories
              </Link>
            </li>


            {/* COMPANIES */}

            <li className="nav-item">
              <Link
                to="/companies"
                className="nav-link"
                onClick={closeAll}
              >
                Companies
              </Link>
            </li>

          </ul>


          {/* ===================================================
              RIGHT SIDE ACTIONS
          =================================================== */}

          <div className="d-flex navbar-actions">

            {loggedUser ? (

              /* =================================================
                 LOGGED IN USER
              ================================================= */

              <div
                className="position-relative navbar-user-dropdown"
                ref={dropdownRef}
              >

                {/* USER BUTTON */}

                <button
                  type="button"
                  className="btn btn-light user-profile-btn"
                  onClick={() => {
                    setShowDropdown((prev) => !prev);
                    setMenuOpen(true);
                  }}
                >
                  👤{" "}
                  {loggedUser.username ||
                    loggedUser.name ||
                    "User"}

                  <span className="ms-1">
                    {showDropdown ? "▲" : "▼"}
                  </span>
                </button>


                {/* USER DROPDOWN */}

                {showDropdown && (
                  <div className="dropdown-menu show navbar-user-menu">

                    {/* MY PROFILE */}

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={closeAll}
                    >
                      👤 My Profile
                    </Link>


                    {/* SAVED JOBS */}

                    <Link
                      to="/saved-jobs"
                      className="dropdown-item"
                      onClick={closeAll}
                    >
                      ❤️ Saved Jobs
                    </Link>


                    {/* MY APPLICATIONS */}

                    <Link
                      to="/applications"
                      className="dropdown-item"
                      onClick={closeAll}
                    >
                      📋 My Applications
                    </Link>


                    {/* DIVIDER */}

                    <div className="dropdown-divider"></div>


                    {/* LOGOUT */}

                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>

                  </div>
                )}

              </div>

            ) : (

              /* =================================================
                 NOT LOGGED IN
              ================================================= */

              <>

                {/* LOGIN */}

                <Link
                  to="/login"
                  className="btn btn-light navbar-login-btn"
                  onClick={closeAll}
                >
                  Login
                </Link>


                {/* ADMIN LOGIN */}

                <Link
                  to="/admin-login"
                  className="btn btn-outline-light navbar-admin-login-btn"
                  onClick={closeAll}
                >
                  Admin Login
                </Link>


                {/* REGISTER */}

                <Link
                  to="/register"
                  className="btn btn-outline-light navbar-register-btn"
                  onClick={closeAll}
                >
                  Register
                </Link>

              </>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
