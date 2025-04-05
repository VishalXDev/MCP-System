import React from "react";

// Pagination Props
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Handle Page Click
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Render Page Numbers
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Show at most 5 pages (previous, next, and 3 pages in between)
    const pageStart = Math.max(1, currentPage - 2);
    const pageEnd = Math.min(totalPages, currentPage + 2);

    for (let i = pageStart; i <= pageEnd; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500"
      >
        Prev
      </button>

      {renderPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
