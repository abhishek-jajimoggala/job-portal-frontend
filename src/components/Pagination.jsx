import React from "react";

function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center">

        {/* Previous */}
        <li
          className={`page-item ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {/* Page Numbers */}
        {[...Array(totalPages)].map(
          (_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1
                  ? "active"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage(index + 1)
                }
              >
                {index + 1}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li
          className={`page-item ${
            currentPage === totalPages
              ? "disabled"
              : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
          >
            Next
          </button>
        </li>

      </ul>
    </nav>
  );
}

export default Pagination;