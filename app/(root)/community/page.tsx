import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";

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

      <div className='mt-11 flex items-center justify-between gap-5'>
        <Searchbar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search amazing minds here...'
          otherClasses='flex-1 '
        />

        <Filter
          filters={UserFilters}
          otherClasses='min-h-[56px] max-w-[250px]'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.users.map((item) => (
          // @ts-ignore
          <UserCard key={item._id} item={item} />
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
