import React from "react";
import GlobalFilters from "./GlobalFilters";

const GlobalResult = () => {
  return (
    <div className='absolute top-full z-10 mt-3 w-full rounded-xl bg-light-700 p-5 dark:bg-dark-400'>
      <GlobalFilters />
    </div>
  );
};

export default GlobalResult;
