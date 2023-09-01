import { Button } from "@/components/ui/button";
import React from "react";

const GlobalFilters = () => {
  return (
    <div className='flex gap-3'>
      <Button className='btn light-border-2 body-medium text-dl-28'>
        Questions
      </Button>
      <Button className='btn light-border-2 body-medium text-dl-28'>
        Tags
      </Button>
      <Button className='btn light-border-2 body-medium text-dl-28'>
        Users
      </Button>
    </div>
  );
};

export default GlobalFilters;
