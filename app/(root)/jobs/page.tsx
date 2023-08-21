import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/jobs/JobsFilter";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import React from "react";

interface Props {
  searchParams: {
    q: string;
    location: string;
    page: string;
  };
}

const Page = async ({ searchParams }: Props) => {
  const userLocation = await fetchLocation();

  const jobs = await fetchJobs({
    query:
      `${searchParams.q}, ${searchParams.location}` ??
      `Software Engineer in ${userLocation}`,
    page: searchParams.page ?? 1,
  });

  const countries = await fetchCountries();
  const page = parseInt(searchParams.page ?? 1);

  return (
    <>
      <h1 className='h1-bold text-white'>Jobs</h1>

      <div className='flex'>
        <JobsFilter countriesList={countries} />
      </div>

      <section className='mt-11 flex flex-col gap-9'>
        {jobs.length > 0 ? (
          jobs.map((job: any) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className='paragraph-regular w-full text-center text-light-700'>
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
