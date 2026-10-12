
import { useEffect, useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminNavbar from "../components/AdminNavbar";
import "./UserProfiles.css";

function UserProfiles() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // ADMIN CHECK
  // =========================
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("admin");

    if (isAdmin !== "true") {
      toast.error("Please Login As Admin");
      navigate("/admin-login");
      return;
    }

    loadUsers();
  }, [navigate]);

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        setUsers(response.data.users || []);

        if (isRefresh) {
          toast.success("Users Refreshed Successfully");
        }
      } else {
        toast.error(
          response.data.message || "Failed To Load Users"
        );
      }
    } catch (error) {
      console.error("USERS ERROR:", error);

      if (error.response?.status === 401) {
        toast.error("Please Login As Admin");

        sessionStorage.removeItem("admin");
        sessionStorage.removeItem("adminId");
        sessionStorage.removeItem("adminName");

        navigate("/admin-login");
        return;
      }

      toast.error("Failed To Load Users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =========================
  // REFRESH
  // =========================
  const handleRefresh = () => {
    loadUsers(true);
  };

  // =========================
  // FILTER USERS
  // =========================
  const filteredUsers = users.filter(
    (user) =>
      user.username
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // DOWNLOAD EXCEL
  // =========================
  const downloadExcel = async () => {
    if (users.length === 0) {
      toast.warning("No Users Available");
      return;
    }

    try {
      setDownloading(true);

      const workbook = new ExcelJS.Workbook();

      workbook.creator = "Job Portal Admin";
      workbook.created = new Date();
      workbook.modified = new Date();

      const worksheet = workbook.addWorksheet(
        "All Users"
      );

      // =========================
      // TITLE
      // =========================
      worksheet.mergeCells("A1:O1");

      const titleCell = worksheet.getCell("A1");

      titleCell.value = "JOB PORTAL - ALL USERS";

      titleCell.font = {
        bold: true,
        size: 16,
      };

      titleCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(1).height = 28;

      // =========================
      // TOTAL USERS
      // =========================
      worksheet.mergeCells("A2:O2");

      const countCell = worksheet.getCell("A2");

      countCell.value =
        `Total Users : ${users.length}`;

      countCell.font = {
        bold: true,
        size: 12,
      };

      countCell.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.getRow(2).height = 22;

      // Empty row
      worksheet.addRow([]);

      // =========================
      // HEADER
      // =========================
      const headerRow = worksheet.addRow([
        "S.No",
        "Profile Image URL",
        "Name",
        "Email",
        "Phone",
        "State",
        "10th",
        "Intermediate",
        "Degree",
        "College",
        "Branch",
        "Skills",
        "Resume URL",
      ]);

      headerRow.height = 30;

      headerRow.eachCell((cell) => {
        cell.font = {
          bold: true,
          size: 11,
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // =========================
      // USERS DATA
      // =========================
      users.forEach((user, index) => {
        const profileImageUrl = user.profile_image
          ? `http://localhost:5000/${user.profile_image}`
          : "N/A";

        const resumeUrl = user.resume_path
          ? `http://localhost:5000/${user.resume_path}`
          : "N/A";

        const createdDate = user.createdAt
          ? new Date(
              user.createdAt
            ).toLocaleDateString()
          : user.created_at
          ? new Date(
              user.created_at
            ).toLocaleDateString()
          : "N/A";

        const row = worksheet.addRow([
          index + 1,
          profileImageUrl,
          user.username || "N/A",
          user.email || "N/A",
          user.phone || "N/A",
          user.state || "N/A",
          user.tenth || "N/A",
          user.intermediate || "N/A",
          user.degree || "N/A",
          user.college || "N/A",
          user.branch || "N/A",
          user.skills || "N/A",
          resumeUrl,
        ]);

        row.height = 30;

        row.eachCell((cell) => {
          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Make URLs clickable
        if (profileImageUrl !== "N/A") {
          row.getCell(2).value = {
            text: profileImageUrl,
            hyperlink: profileImageUrl,
          };

          row.getCell(2).font = {
            color: {
              argb: "0563C1",
            },
            underline: true,
          };
        }

        if (resumeUrl !== "N/A") {
          row.getCell(13).value = {
            text: resumeUrl,
            hyperlink: resumeUrl,
          };

          row.getCell(13).font = {
            color: {
              argb: "0563C1",
            },
            underline: true,
          };
        }
      });

      // =========================
      // COLUMN WIDTHS
      // =========================
      worksheet.columns = [
        {
          key: "sno",
          width: 8,
        },
        {
          key: "profileImage",
          width: 45,
        },
        {
          key: "name",
          width: 25,
        },
        {
          key: "email",
          width: 32,
        },
        {
          key: "phone",
          width: 17,
        },
        {
          key: "state",
          width: 18,
        },
        {
          key: "tenth",
          width: 18,
        },
        {
          key: "intermediate",
          width: 20,
        },
        {
          key: "degree",
          width: 25,
        },
        {
          key: "college",
          width: 30,
        },
        {
          key: "branch",
          width: 22,
        },
        {
          key: "skills",
          width: 40,
        },
        {
          key: "resume",
          width: 50,
        },
        {
          key: "status",
          width: 18,
        },
        {
          key: "createdDate",
          width: 18,
        },
      ];

      // =========================
      // FREEZE HEADER
      // =========================
      worksheet.views = [
        {
          state: "frozen",
          ySplit: 4,
        },
      ];

      // =========================
      // FILTER
      // =========================
      worksheet.autoFilter = {
        from: "A4",
        to: "O4",
      };

      // =========================
      // CREATE EXCEL
      // =========================
      const buffer =
        await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `All_Users_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        `${users.length} Users Exported Successfully`
      );
    } catch (error) {
      console.error(
        "EXCEL DOWNLOAD ERROR:",
        error
      );

      toast.error("Failed To Download Excel");
    } finally {
      setDownloading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <>
        <AdminNavbar />

        <div className="user-loading">
          <div className="spinner-border text-primary"></div>

          <h4>Loading Users...</h4>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <div className="user-profiles-page">

        {/* =========================
            TOP ACTIONS
        ========================= */}

        <div className="users-top-actions">

          <Link
            to="/admin"
            className="btn btn-dark users-dashboard-btn"
          >
            ← Dashboard
          </Link>

          <div className="users-action-buttons">

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Refreshing...
                </>
              ) : (
                <>
                  ↻ Refresh
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={downloadExcel}
              disabled={
                users.length === 0 ||
                downloading
              }
            >
              {downloading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>

                  Downloading...
                </>
              ) : (
                <>
                  📊 Download Excel
                </>
              )}
            </button>

          </div>

        </div>

        {/* =========================
            PAGE HEADER
        ========================= */}

        <div className="page-header">

          <div>
            <h2>
              👥 User Profiles
            </h2>

            <p>
              Total Users :{" "}
              <strong>{users.length}</strong>
            </p>
          </div>

          <div className="users-count-box">
            <span className="users-count-number">
              {users.length}
            </span>

            <span className="users-count-label">
              Total Users
            </span>
          </div>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="search-box">

          <input
            type="text"
            className="form-control"
            placeholder="Search Users..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* =========================
            USERS
        ========================= */}

        {filteredUsers.length === 0 ? (

          <div className="alert alert-info mt-4">
            No Users Found
          </div>

        ) : (

          filteredUsers.map((user) => (

            <div
              key={user.id}
              className="card user-card mb-4"
            >

              <div className="card-body">

                <div className="row align-items-center">

                  {/* PROFILE IMAGE */}

                  <div className="col-lg-2 text-center">

                    <img
                      src={
                        user.profile_image
                          ? `http://localhost:5000/${user.profile_image}`
                          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="user"
                      className="profile-img"
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="col-lg-7">

                    <h4 className="user-name">
                      {user.username}
                    </h4>

                    <p>
                      📧 {user.email}
                    </p>

                    <p>
                      📱 {user.phone || "N/A"}
                    </p>

                    <p>
                      📍 {user.state || "N/A"}
                    </p>

                    <div>

                      {user.skills ? (
                        user.skills
                          .split(",")
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="badge bg-primary me-2 mb-2"
                            >
                              {skill.trim()}
                            </span>
                          ))
                      ) : (
                        <span>
                          No Skills
                        </span>
                      )}

                    </div>

                  </div>

                  {/* ACTION */}

                  <div className="col-lg-3 text-end">

                    <button
                      type="button"
                      className="btn btn-info me-2"
                      onClick={() =>
                        setSelectedUser(user)
                      }
                    >
                      👤 View Profile
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))
        )}

        {/* =========================
            PROFILE MODAL
        ========================= */}

        {selectedUser && (

          <div
            className="modal show d-block"
            style={{
              background:
                "rgba(0,0,0,0.6)",
            }}
          >

            <div className="modal-dialog modal-lg modal-dialog-centered">

              <div className="modal-content">

                <div className="modal-header bg-primary text-white">

                  <h5 className="modal-title">
                    User Profile
                  </h5>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setSelectedUser(null)
                    }
                  ></button>

                </div>

                <div className="modal-body">

                  {/* PROFILE IMAGE */}

                  <div className="text-center mb-4">

                    <img
                      src={
                        selectedUser.profile_image
                          ? `http://localhost:5000/${selectedUser.profile_image}`
                          : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      alt="profile"
                      width="140"
                      height="140"
                      className="rounded-circle border"
                    />

                  </div>

                  <h4>
                    {selectedUser.username}
                  </h4>

                  <p>
                    📧 {selectedUser.email}
                  </p>

                  <p>
                    📱{" "}
                    {selectedUser.phone || "N/A"}
                  </p>

                  <p>
                    📍{" "}
                    {selectedUser.state || "N/A"}
                  </p>

                  <hr />

                  {/* EDUCATION */}

                  <h5>
                    🎓 Education
                  </h5>

                  <p>
                    <b>10th:</b>{" "}
                    {selectedUser.tenth || "N/A"}
                  </p>

                  <p>
                    <b>Intermediate:</b>{" "}
                    {selectedUser.intermediate ||
                      "N/A"}
                  </p>

                  <p>
                    <b>Degree:</b>{" "}
                    {selectedUser.degree ||
                      "N/A"}
                  </p>

                  <p>
                    <b>College:</b>{" "}
                    {selectedUser.college ||
                      "N/A"}
                  </p>

                  <p>
                    <b>Branch:</b>{" "}
                    {selectedUser.branch ||
                      "N/A"}
                  </p>

                  <hr />

                  {/* SKILLS */}

                  <h5>
                    🛠 Skills
                  </h5>

                  <p>
                    {selectedUser.skills ||
                      "No Skills Added"}
                  </p>

                  {/* RESUME */}

                  {selectedUser.resume_path && (

                    <a
                      href={`http://localhost:5000/${selectedUser.resume_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success"
                    >
                      📄 View Resume
                    </a>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default UserProfiles;
