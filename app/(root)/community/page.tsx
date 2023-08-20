import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/lib/actions/user.action";
import Image from "next/image";

interface Params {
  searchParams: {
    [key: string]: string | undefined;
  };
}

const Page = async ({ searchParams }: Params) => {
  const result = await getAllUsers({
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold text-white'>All Users</h1>

      <div className='flex items-center justify-between'>
        <Searchbar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search amazing minds here...'
          classname='mt-11'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.users.map((item) => (
          <article
            key={item._id}
            className='flex w-fit flex-col items-center justify-center rounded-2xl border border-dark-300 bg-dark-200 p-8'
          >
            <Image
              src={item.picture}
              alt='user'
              width={100}
              height={100}
              className='rounded-full'
            />

            <div className='mt-4 text-center'>
              <h3 className='h3-bold text-white'>{item.name}</h3>
              <p className='body-regular mt-2 text-light-500'>
                @{item.username}
              </p>
            </div>

            <div className='mt-5 flex flex-wrap gap-2'>
              {["CSS", "NEXT.js", "TEST"].map((tag) => (
                <Badge
                  key={tag}
                  className='subtle-medium px-4 py-2 uppercase text-light-500'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </article>
        ))}
      </section>

      <div className='mt-10'>
        <Pagination
          path='community'
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Page;
