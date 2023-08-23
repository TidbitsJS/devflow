import Image from "next/image";
import Link from "next/link";

import { Job } from "@/types";
import { processJobTitle } from "@/lib/utils";

interface JobLocationProps {
  job_country: string | undefined;
  job_city: string | undefined;
  job_state: string | undefined;
}

const JobLocation = ({
  job_country,
  job_city,
  job_state,
}: JobLocationProps) => {
  return (
    <div className='job-tag-background-shade flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5'>
      <Image
        src={`https://flagsapi.com/${job_country}/flat/64.png`}
        alt='country symbol'
        width={16}
        height={16}
        className='rounded-full'
      />

      <p className='body-medium small3-color'>
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {job_country && `${job_country}`}
      </p>
    </div>
  );
};

type JobCardProps = {
  job: Job;
};

const JobCard = ({ job }: JobCardProps) => {
  const {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
  } = job;

  console.log(job_title);

  return (
    <section className='common-background-shade light-border flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8'>
      <div className='flex w-full justify-end sm:hidden'>
        <JobLocation
          job_country={job_country}
          job_city={job_city}
          job_state={job_state}
        />
      </div>

      <div className='flex items-center gap-6'>
        {employer_logo ? (
          <Link
            href={employer_website ?? "/jobs"}
            className='job-tag-background-shade relative h-16 w-16 rounded-xl'
          >
            <Image
              src={employer_logo}
              alt='company logo'
              fill
              className='h-full w-full object-contain p-2'
            />
          </Link>
        ) : (
          <Image
            src='/assets/images/site-logo.svg'
            alt='default site logo'
            width={64}
            height={64}
            className='rounded-[10px]'
          />
        )}
      </div>

      <div className='w-full'>
        <div className='flex-between flex-wrap gap-2'>
          <p className='base-semibold heading2-color'>
            {processJobTitle(job_title)}
          </p>

          <div className='hidden sm:flex'>
            <JobLocation
              job_country={job_country}
              job_city={job_city}
              job_state={job_state}
            />
          </div>
        </div>

        <p className='body-regular body2-color  mt-2 line-clamp-2'>
          {job_description?.slice(0, 200)}
        </p>

        <div className='flex-between mt-8 flex-wrap gap-6'>
          <div className='flex flex-wrap items-center gap-6'>
            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/clock-2.svg'
                alt='clock'
                width={20}
                height={20}
              />

              <p className='body-medium text-light-500'>
                {job_employment_type}
              </p>
            </div>

            <div className='flex items-center gap-2'>
              <Image
                src='/assets/icons/currency-dollar-circle.svg'
                alt='dollar symbol'
                width={20}
                height={20}
              />

              <p className='body-medium text-light-500'>Not disclosed</p>
            </div>
          </div>

          <Link
            href={job_apply_link ?? "/jobs"}
            target='_blank'
            className='flex items-center gap-2'
          >
            <p className='body-semibold primary-text-gradient'>View job</p>

            <Image
              src='/assets/icons/arrow-up-right.svg'
              alt='arrow up right'
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCard;
