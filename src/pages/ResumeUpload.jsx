import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const uploadResume = async () => {
    if (!resume) {
      toast.error("Please Select Resume");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const userId = sessionStorage.getItem("userId");

      const response = await axios.post(
        `http://localhost:5000/api/upload-resume/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResumeUrl(response.data.resume_url);

      toast.success(
        response.data.message ||
          "Resume Uploaded Successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error("Resume Upload Failed");
    }
  };

  return (
    <div className="container my-5">

      <div className="mb-3">
        <Link
          to="/admin"
          className="btn btn-dark"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="card shadow p-4">
        <h2 className="mb-4">
          Upload Resume
        </h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="form-control"
          onChange={(e) =>
            setResume(e.target.files[0])
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={uploadResume}
        >
          Upload Resume
        </button>

        {resumeUrl && (
          <div className="mt-4">
            <h5>Uploaded Resume</h5>

            <a
              href={`http://localhost:5000/${resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success"
            >
              View Resume
            </a>
          </div>
        )}
      </div>

    </div>
  );
}

export default ResumeUpload;