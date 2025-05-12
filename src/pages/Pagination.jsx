const Pagination = ({ currentPage, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        onClick={() => onPageChange(-1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-lg font-medium">Page {currentPage}</span>
      <button
        onClick={() => onPageChange(1)}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
