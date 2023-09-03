import Link from "next/link";

import Filter from "@/components/shared/Filter";
import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";

import { SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllUsers({
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold heading1-color'>All Users</h1>

      <div className='mt-11 flex items-center justify-between gap-5'>
        <LocalSearchbar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search amazing minds here...'
          otherClasses='flex-1 '
        />

        <Filter
          filters={UserFilters}
          otherClasses='min-h-[56px] min-w-[170px]'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.users.length > 0 ? (
          result.users.map((item) => (
            // @ts-ignore
            <UserCard key={item._id} item={item} />
          ))
        ) : (
          <div className='paragraph-regular text-dl-28 mx-auto max-w-4xl text-center'>
            <p>No users yet.</p>
            <Link href='/sign-up' className='mt-1 font-bold text-accent-blue'>
              Join Now to be the First 🚀
            </Link>
          </div>
        )}
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
