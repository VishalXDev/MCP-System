import React from "react";

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
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage > 2) {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6 text-sm font-medium">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500 hover:bg-gray-600"
      >
        First
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500 hover:bg-gray-600"
      >
        Prev
      </button>

      {renderPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`px-3 py-2 rounded focus:outline-none focus:ring-2 ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500 hover:bg-gray-600"
      >
        Next
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded bg-gray-700 text-white disabled:bg-gray-500 hover:bg-gray-600"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
