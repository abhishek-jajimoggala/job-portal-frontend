
import { Navigate, Link } from "react-router-dom";

function AdminProfile() {
  const isAdmin =
    sessionStorage.getItem("admin") === "true";

  const adminName =
    sessionStorage.getItem("adminName") ||
    sessionStorage.getItem("admin_name") ||
    sessionStorage.getItem("admin_name");

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin" className="btn btn-outline-primary">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body p-5 text-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "40px",
                }}
              >
                👤
              </div>

              <h2 className="fw-bold mb-4">Admin Profile</h2>

              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{adminName || "Admin name not found"}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>Administrator</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>
                      <span className="badge bg-success">
                        Active
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
