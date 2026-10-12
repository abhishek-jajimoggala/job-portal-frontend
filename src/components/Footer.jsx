import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-5">
      <div className="container py-5">

        <div className="row">

          {/* About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h3 className="fw-bold text-primary">
              JobPortal
            </h3>

            <p className="text-light">
              Find your dream job from thousands
              of opportunities across India.
              Connect with top companies and
              build your career.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-3">
              Quick Links
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                <Link
                  to="/"
                  className="text-white text-decoration-none"
                >
                  Home
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/jobs"
                  className="text-white text-decoration-none"
                >
                  Jobs
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/companies"
                  className="text-white text-decoration-none"
                >
                  Companies
                </Link>
              </li>

              <li className="mb-2">
                <Link
                  to="/my-applications"
                  className="text-white text-decoration-none"
                >
                  My Applications
                </Link>
              </li>

            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">
              Popular Categories
            </h5>

            <ul className="list-unstyled">

              <li className="mb-2">
                React Developer
              </li>

              <li className="mb-2">
                Python Developer
              </li>

              <li className="mb-2">
                Java Developer
              </li>

              <li className="mb-2">
                Data Analyst
              </li>

              <li className="mb-2">
                Full Stack Developer
              </li>

            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3">
              Contact Us
            </h5>

            <p>
              📧 support@jobportal.com
            </p>

            <p>
              📞 +91 9876543210
            </p>

            <p>
              📍 Hyderabad, Telangana, India
            </p>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center">
          <p className="mb-0">
            © 2026 JobPortal. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;