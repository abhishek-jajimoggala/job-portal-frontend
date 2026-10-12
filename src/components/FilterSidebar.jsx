import React from "react";

function FilterSidebar({
  location,
  setLocation,
  experience,
  setExperience,
  salary,
  setSalary,
}) {
  const clearFilters = () => {
    setLocation("");
    setExperience("");
    setSalary("");
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">

        <h5 className="fw-bold mb-4">
          🔍 Filters
        </h5>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Location
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Enter Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />
        </div>

        {/* Experience */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Experience
          </label>

          <select
            className="form-select"
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
          >
            <option value="">
              All Experience
            </option>

            <option value="0">
              Fresher
            </option>

            <option value="1">
              1+ Years
            </option>

            <option value="2">
              2+ Years
            </option>

            <option value="3">
              3+ Years
            </option>

            <option value="5">
              5+ Years
            </option>
          </select>
        </div>

        {/* Salary */}
        <div className="mb-3">
          <label className="form-label fw-semibold">
            Salary
          </label>

          <select
            className="form-select"
            value={salary}
            onChange={(e) =>
              setSalary(e.target.value)
            }
          >
            <option value="">
              All Salaries
            </option>

            <option value="300000">
              3 LPA+
            </option>

            <option value="500000">
              5 LPA+
            </option>

            <option value="800000">
              8 LPA+
            </option>

            <option value="1000000">
              10 LPA+
            </option>

            <option value="1500000">
              15 LPA+
            </option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          className="btn btn-outline-secondary w-100"
          onClick={clearFilters}
        >
          Clear Filters
        </button>

      </div>
    </div>
  );
}

export default FilterSidebar;
