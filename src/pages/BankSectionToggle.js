import React from "react";

const BankSectionToggle = (props) => {
  const {
    showLoanCard = false,
    setShowLoanCard = () => {
      console.error("setShowLoanCard not provided");
    },
  } = props;

  React.useEffect(() => {
    console.log("BankSectionToggle props:", props);
  }, [props]);

  return (
    <div className="absolute top-28 left-5 max-w-[300px] p-2 bg-indigo-800 rounded-full items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex cursor-pointer">
      <span
        className={`font-semibold mr-2 text-left flex-auto text-sm ${
          !showLoanCard
            ? "bg-indigo-500 rounded-full px-2 py-1 text-white"
            : "text-indigo-100"
        }`}
        onClick={() => {
          console.log("BANK AI AGENT clicked");
          setShowLoanCard(false);
        }}
      >
        BANK AI AGENT
      </span>
      <span
        className={`font-semibold mr-2 text-left flex-auto ${
          showLoanCard
            ? "bg-indigo-500 rounded-full px-2 py-1 text-white"
            : "text-indigo-100"
        }`}
        onClick={() => {
          console.log("Loan Available clicked");
          setShowLoanCard(true);
        }}
      >
        Loan Available
      </span>
      <svg
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-current opacity-75 h-4 w-4"
      >
        <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"></path>
      </svg>
    </div>
  );
};

export default BankSectionToggle;
