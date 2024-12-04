const LoanCard = ({ loan, handleLoanClick }) => {
  return (
    <div className="absolute top-44 left-5 bg-gradient-to-br from-purple-800 to-indigo-900 shadow-2xl rounded-xl p-6 text-white border-4 border-yellow-400 transform transition-all duration-300 hover:scale-[1.02]">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-yellow-300 tracking-wider uppercase">
            Power-Up Loan
          </h2>
        </div>

        <div className="space-y-2 bg-purple-900/50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-yellow-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Loan Amount : {loan}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Powered by bullieverse beyond API.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="text-center flex-1 bg-yellow-400 text-purple-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors uppercase tracking-wider shadow-lg">
          Accept
        </button>
        <button
          className="text-center flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors uppercase tracking-wider shadow-lg"
          onClick={handleLoanClick}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoanCard;
