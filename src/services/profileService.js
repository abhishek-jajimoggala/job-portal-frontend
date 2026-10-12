import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

// Get Profile
export const getProfile = async (email) => {
  try {
    const response = await axios.get(
      `${API_URL}/profile/${email}`
    );

    return response.data;
  } catch (error) {
    console.error("Get Profile Error:", error);
    throw error;
  }
};

// Update Profile
export const updateProfile = async (
  email,
  profileData
) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile/${email}`,
      profileData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error;
  }
};

// Upload Resume
export const uploadResume = async (
  userId,
  formData
) => {
  try {
    const response = await axios.post(
      `${API_URL}/upload-resume/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload Resume Error:", error);
    throw error;
  }
};

// Upload Profile Image
export const uploadProfileImage = async (
  email,
  formData
) => {
  try {
    const response = await axios.post(
      `${API_URL}/upload-profile-image/${email}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Upload Profile Image Error:",
      error
    );
    throw error;
  }
};

// Download Resume
export const downloadResume = async (
  userId
) => {
  try {
    const response = await axios.get(
      `${API_URL}/download-resume/${userId}`,
      {
        responseType: "blob",
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Download Resume Error:",
      error
    );
    throw error;
  }
};

// View Profile Photo
export const viewPhoto = async (
  userId
) => {
  try {
    const response = await axios.get(
      `${API_URL}/view-photo/${userId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "View Photo Error:",
      error
    );
    throw error;
  }
};