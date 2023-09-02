import Link from "next/link";

import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";

import { SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold heading1-color'>Tags</h1>

      <div className='mt-11 flex items-center justify-between gap-5'>
        <LocalSearchbar
          route='/tags'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search by tag name...'
          otherClasses=''
        />

        <Filter
          filters={TagFilters}
          otherClasses='min-h-[56px] min-w-[170px]'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.tags.map((tag) => (
          <article
            key={tag._id}
            className='common-background-shade light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]'
          >
            <Link href={`/tags/${tag._id}`}>
              <div className='job-tag-background-shade w-fit rounded-sm px-5 py-1.5'>
                <p className='paragraph-semibold base-color'>{tag.name}</p>
              </div>
            </Link>

            <p className='small-regular small2-color mt-4'>
              JavaScript, often abbreviated as JS, is a programming language
              that is one of the core technologies of the World Wide Web,
              alongside HTML and CSS
            </p>

            <p className='small-medium small5-color mt-3.5'>
              <span className='body-semibold primary-text-gradient mr-2.5'>
                {tag.questions.length}+
              </span>
              Questions
            </p>
          </article>
        ))}
      </section>

      <div className='mt-10'>
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
