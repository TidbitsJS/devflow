import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { getAllTags } from "@/lib/actions/tag.action";

interface Params {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const Page = async ({ searchParams }: Params) => {
  const result = await getAllTags({
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold text-white'>Tags</h1>

      <div className='flex items-center justify-between'>
        <Searchbar
          route='/tags'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search by tag name...'
          classname='mt-11'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.tags.map((tag) => (
          <article
            key={tag._id}
            className='flex w-full flex-col rounded-2xl border border-dark-300 bg-dark-200 px-8 py-10 sm:w-[260px]'
          >
            <div className='w-fit rounded-sm bg-dark-400 px-5 py-1.5'>
              <p className='paragraph-semibold text-white'>{tag.name}</p>
            </div>

            <p className='small-regular mt-4 text-light-700'>
              JavaScript, often abbreviated as JS, is a programming language
              that is one of the core technologies of the World Wide Web,
              alongside HTML and CSS
            </p>

            <p className='small-medium mt-3.5 text-light-500'>
              <span className='body-semibold primary-text-gradient mr-2.5'>
                {tag.questionsCount}+
              </span>
              Questions
            </p>
          </article>
        ))}
      </section>

      <div className='mt-10'>
        <Pagination
          path='tags'
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
