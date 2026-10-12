import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/Profile.css";

import {
  Country,
  State,
  City,
} from "country-state-city";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    skills: "",
    tenth: "",
    intermediate: "",
    degree: "",
    college: "",
    branch: "",
    passout_year: "",
    experience: "",
    linkedin: "",
    github: "",
    profile_image: "",
    resume_path: "",
  });

  /* =========================================
     LOAD PROFILE
  ========================================= */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/profile/${userId}`
      );

      const profile = response.data.user;

      setUser({
        username: profile?.username || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        country: profile?.country || "",
        state: profile?.state || "",
        city: profile?.city || "",
        skills: profile?.skills || "",
        tenth: profile?.tenth || "",
        intermediate: profile?.intermediate || "",
        degree: profile?.degree || "",
        college: profile?.college || "",
        branch: profile?.branch || "",
        passout_year: profile?.passout_year || "",
        experience: profile?.experience || "",
        linkedin: profile?.linkedin || "",
        github: profile?.github || "",
        profile_image: profile?.profile_image || "",
        resume_path: profile?.resume_path || "",
      });
    } catch (error) {
      console.error(
        "LOAD PROFILE ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed To Load Profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setUser((prev) => ({
        ...prev,
        country: value,
        state: "",
        city: "",
      }));
    } else if (name === "state") {
      setUser((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
    } else {
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* =========================================
     SAVE PROFILE
  ========================================= */

  const saveProfile = async () => {
    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/profile/${userId}`,
        user
      );

      toast.success("Profile Updated Successfully");

      setIsEdit(false);

      await loadProfile();
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Profile Update Failed"
      );
    }
  };

  /* =========================================
     UPLOAD PROFILE IMAGE
  ========================================= */

  const uploadProfileImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const formData = new FormData();

      // Backend expects "image"
      formData.append("image", file);

      const response = await axios.post(
        `http://localhost:5000/api/profile/${userId}/image`,
        formData
      );

      setUser((prev) => ({
        ...prev,
        profile_image: response.data.image_url,
      }));

      toast.success(
        "Profile Image Uploaded Successfully"
      );
    } catch (error) {
      console.error(
        "IMAGE UPLOAD ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Image Upload Failed"
      );
    }
  };

  /* =========================================
     UPLOAD RESUME
  ========================================= */

  const uploadResume = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        toast.error("User ID not found. Please login again.");
        return;
      }

      const formData = new FormData();

      // Backend expects "resume"
      formData.append("resume", file);

      const response = await axios.post(
        `http://localhost:5000/api/profile/${userId}/resume`,
        formData
      );

      setUser((prev) => ({
        ...prev,
        resume_path: response.data.resume_url,
      }));

      toast.success(
        "Resume Uploaded Successfully"
      );
    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Resume Upload Failed"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading Profile...</p>
      </div>
    );
  }

  /* =========================================
     IMAGE URL
  ========================================= */

  const profileImageUrl = user.profile_image
    ? `http://localhost:5000/${user.profile_image.replace(
        /\\/g,
        "/"
      )}`
    : "https://ui-avatars.com/api/?name=User&background=2563eb&color=fff";

  /* =========================================
     RESUME URL
  ========================================= */

  const resumeUrl = user.resume_path
    ? `http://localhost:5000/${user.resume_path.replace(
        /\\/g,
        "/"
      )}`
    : "";

  /* =========================================
     EXTERNAL LINK URL
  ========================================= */

  const getExternalUrl = (url) => {
    if (!url) {
      return "#";
    }

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `https://${url}`;
  };

  /* =========================================
     COUNTRY NAME
  ========================================= */

  const countryName =
    Country.getCountryByCode(user.country)?.name ||
    user.country ||
    "Not provided";

  /* =========================================
     STATE NAME
  ========================================= */

  const stateName =
    State.getStateByCodeAndCountry(
      user.state,
      user.country
    )?.name ||
    user.state ||
    "Not provided";

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* =====================================
            MAIN CARD
        ===================================== */}

        <div className="profile-main-card">

          {/* COVER */}
          <div className="profile-cover"></div>

          {/* PROFILE HEADER */}
          <div className="profile-header">

            <div className="profile-image-wrapper">

              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-photo"
              />

              {isEdit && (
                <label className="image-edit-button">
                  📷
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={uploadProfileImage}
                  />
                </label>
              )}

            </div>

            <h2>
              {user.username || "User"}
            </h2>

            <p className="profile-email">
              {user.email}
            </p>

          </div>

          {/* =====================================
              VIEW MODE
          ===================================== */}

          {!isEdit ? (
            <>

              {/* PERSONAL DETAILS */}

              <div className="profile-section">

                <h5>Personal Details</h5>

                <div className="details-grid">

                  <div className="detail-item">
                    <span>Phone</span>
                    <strong>
                      {user.phone || "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Country</span>
                    <strong>
                      {countryName}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>State</span>
                    <strong>
                      {stateName}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>City</span>
                    <strong>
                      {user.city || "Not provided"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* EDUCATION */}

              <div className="profile-section">

                <h5>Education & Experience</h5>

                <div className="details-grid">

                  <div className="detail-item">
                    <span>10th</span>
                    <strong>
                      {user.tenth || "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Intermediate</span>
                    <strong>
                      {user.intermediate ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Degree</span>
                    <strong>
                      {user.degree || "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>College</span>
                    <strong>
                      {user.college || "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Branch</span>
                    <strong>
                      {user.branch || "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Passout Year</span>
                    <strong>
                      {user.passout_year ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>Experience</span>
                    <strong>
                      {user.experience ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>

              </div>

              {/* SKILLS */}

              <div className="profile-section">

                <h5>Skills</h5>

                {user.skills ? (
                  <div className="skills-box">

                    {user.skills
                      .split(",")
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="skill-item"
                        >
                          {skill.trim()}
                        </span>
                      ))}

                  </div>
                ) : (
                  <p className="empty-text">
                    No skills added
                  </p>
                )}

              </div>

              {/* RESUME & LINKS */}

              <div className="profile-section">

                <h5>Resume & Links</h5>

                <div className="profile-links">

                  {/* LINKEDIN */}

                  {user.linkedin && (
                    <a
                      href={getExternalUrl(
                        user.linkedin
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="linkedin-btn"
                    >
                      LinkedIn
                    </a>
                  )}

                  {/* GITHUB */}

                  {user.github && (
                    <a
                      href={getExternalUrl(
                        user.github
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="github-btn"
                    >
                      GitHub
                    </a>
                  )}

                  {/* RESUME */}

                  {user.resume_path && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-btn"
                    >
                      View Resume
                    </a>
                  )}

                </div>

                {!user.linkedin &&
                  !user.github &&
                  !user.resume_path && (
                    <p className="empty-text">
                      No resume or links added
                    </p>
                  )}

              </div>

              {/* EDIT BUTTON */}

              <div className="profile-action-area">

                <button
                  className="edit-profile-btn"
                  onClick={() =>
                    setIsEdit(true)
                  }
                >
                  Edit Profile
                </button>

              </div>

            </>
          ) : (

            /* =====================================
               EDIT MODE
            ===================================== */

            <div className="edit-profile-area">

              {/* BASIC DETAILS */}

              <div className="profile-section">

                <h5>Personal Details</h5>

                <div className="form-grid">

                  {/* NAME */}

                  <div className="form-group">

                    <label>Name</label>

                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />

                  </div>

                  {/* PHONE */}

                  <div className="form-group">

                    <label>Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />

                  </div>

                  {/* COUNTRY */}

                  <div className="form-group">

                    <label>Country</label>

                    <select
                      name="country"
                      value={user.country}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select Country
                      </option>

                      {Country.getAllCountries().map(
                        (country) => (
                          <option
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* STATE */}

                  <div className="form-group">

                    <label>State</label>

                    <select
                      name="state"
                      value={user.state}
                      onChange={handleChange}
                      disabled={!user.country}
                    >

                      <option value="">
                        Select State
                      </option>

                      {user.country &&
                        State.getStatesOfCountry(
                          user.country
                        ).map((state) => (
                          <option
                            key={state.isoCode}
                            value={state.isoCode}
                          >
                            {state.name}
                          </option>
                        ))}

                    </select>

                  </div>

                  {/* CITY */}

                  <div className="form-group">

                    <label>City</label>

                    <select
                      name="city"
                      value={user.city}
                      onChange={handleChange}
                      disabled={
                        !user.country ||
                        !user.state
                      }
                    >

                      <option value="">
                        Select City
                      </option>

                      {user.country &&
                        user.state &&
                        City.getCitiesOfState(
                          user.country,
                          user.state
                        ).map((city, index) => (
                          <option
                            key={`${city.name}-${index}`}
                            value={city.name}
                          >
                            {city.name}
                          </option>
                        ))}

                    </select>

                  </div>

                </div>

              </div>

              {/* PROFILE IMAGE */}

              <div className="profile-section">

                <h5>Profile Image</h5>

                <div className="file-upload-box">

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={uploadProfileImage}
                  />

                  <small>
                    JPG, JPEG, PNG and WEBP only
                  </small>

                </div>

              </div>

              {/* RESUME */}

              <div className="profile-section">

                <h5>Resume</h5>

                <div className="file-upload-box">

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={uploadResume}
                  />

                  <small>
                    PDF, DOC and DOCX only
                  </small>

                  {user.resume_path && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="current-resume"
                    >
                      View Current Resume
                    </a>
                  )}

                </div>

              </div>

              {/* EDUCATION */}

              <div className="profile-section">

                <h5>Education & Experience</h5>

                <div className="form-grid">

                  {/* DEGREE */}

                  <div className="form-group">

                    <label>Degree</label>

                    <input
                      type="text"
                      name="degree"
                      value={user.degree}
                      onChange={handleChange}
                      placeholder="B.Sc / B.Tech"
                    />

                  </div>

                  {/* COLLEGE */}

                  <div className="form-group">

                    <label>College</label>

                    <input
                      type="text"
                      name="college"
                      value={user.college}
                      onChange={handleChange}
                      placeholder="College Name"
                    />

                  </div>

                  {/* BRANCH */}

                  <div className="form-group">

                    <label>Branch</label>

                    <input
                      type="text"
                      name="branch"
                      value={user.branch}
                      onChange={handleChange}
                      placeholder="Computer Science"
                    />

                  </div>

                  {/* PASSOUT */}

                  <div className="form-group">

                    <label>Passout Year</label>

                    <input
                      type="text"
                      name="passout_year"
                      value={user.passout_year}
                      onChange={handleChange}
                      placeholder="2025"
                    />

                  </div>

                  {/* EXPERIENCE */}

                  <div className="form-group">

                    <label>Experience</label>

                    <input
                      type="text"
                      name="experience"
                      value={user.experience}
                      onChange={handleChange}
                      placeholder="Fresher / 1 Year"
                    />

                  </div>

                  {/* LINKEDIN */}

                  <div className="form-group">

                    <label>LinkedIn</label>

                    <input
                      type="text"
                      name="linkedin"
                      value={user.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                    />

                  </div>

                  {/* GITHUB */}

                  <div className="form-group">

                    <label>GitHub</label>

                    <input
                      type="text"
                      name="github"
                      value={user.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                    />

                  </div>

                  {/* 10TH */}

                  <div className="form-group">

                    <label>10th Percentage</label>

                    <input
                      type="text"
                      name="tenth"
                      value={user.tenth}
                      onChange={handleChange}
                      placeholder="90%"
                    />

                  </div>

                  {/* INTERMEDIATE */}

                  <div className="form-group">

                    <label>
                      Intermediate Percentage
                    </label>

                    <input
                      type="text"
                      name="intermediate"
                      value={user.intermediate}
                      onChange={handleChange}
                      placeholder="85%"
                    />

                  </div>

                  {/* SKILLS */}

                  <div className="form-group full-width">

                    <label>Skills</label>

                    <textarea
                      name="skills"
                      value={user.skills}
                      onChange={handleChange}
                      rows="4"
                      placeholder="React, Python, Flask, MySQL, HTML, CSS"
                    ></textarea>

                    <small>
                      Separate skills using commas.
                    </small>

                  </div>

                </div>

              </div>

              {/* SAVE / CANCEL */}

              <div className="edit-buttons">

                <button
                  className="save-btn"
                  onClick={saveProfile}
                >
                  Save Profile
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsEdit(false);
                    loadProfile();
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Profile;