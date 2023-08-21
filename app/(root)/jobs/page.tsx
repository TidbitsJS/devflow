import JobCard from "@/components/cards/JobCard";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import React from "react";

interface Props {
  searchParams: {
    query: string;
    employment_types: string;
    page: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const userLocation = await fetchLocation();

  const jobs = await fetchJobs({
    query: searchParams.query ?? `Software Engineer in ${userLocation}`,
    employment_types: searchParams.employment_types ?? "fulltime",
    page: searchParams.page ?? 1,
  });

  const countries = await fetchCountries();
  const page = parseInt(searchParams.page ?? 1);

  return (
    <>
      <h1 className='h1-bold text-white'>Jobs</h1>

      <section className='mt-11 flex flex-col gap-9'>
        {jobs.length > 0 ? (
          jobs.map((job: any) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className='paragraph-regular w-full text-center text-light-700'>
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later{" "}
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
