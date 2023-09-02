import Link from "next/link";
import Image from "next/image";
import { auth, SignedIn } from "@clerk/nextjs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnswerCard from "@/components/cards/AnswerCard";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/cards/QuestionCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getJoinedDate } from "@/lib/utils";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { getUserById, getUserStats } from "@/lib/actions/user.action";
import Stats from "@/components/Profile/Stats";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

const Page = async ({ params, searchParams }: Props) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId: params.id });
  if (!mongoUser) return null;

  const interactedTags = await getTopInteractedTags({
    userId: mongoUser._id,
    limit: 10,
  });

  const userStats = await getUserStats({
    userId: mongoUser._id,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <Image
            src={mongoUser.picture}
            alt='user avatar'
            width={140}
            height={140}
            className='rounded-full object-cover'
          />

          <div className='mt-3'>
            <h2 className='h2-bold heading1-color'>{mongoUser.name}</h2>
            <p className='paragraph-regular text-dl-28'>
              @{mongoUser.username}
            </p>

            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              {mongoUser.portfolioWebsite && (
                <div className='flex-center gap-1'>
                  <Image
                    src='/assets/icons/link.svg'
                    alt='link icon'
                    width={20}
                    height={20}
                  />

                  <Link
                    href={mongoUser.portfolioWebsite}
                    target='_blank'
                    className='paragraph-medium  text-accent-blue'
                  >
                    Portfolio
                  </Link>
                </div>
              )}

              {mongoUser.location && (
                <div className='flex-center gap-1'>
                  <Image
                    src='/assets/icons/location.svg'
                    alt='link icon'
                    width={20}
                    height={20}
                  />

                  <p className='paragraph-medium body-color'>
                    {mongoUser.location}
                  </p>
                </div>
              )}

              <div className='flex-center gap-1'>
                <Image
                  src='/assets/icons/calendar.svg'
                  alt='link icon'
                  width={20}
                  height={20}
                />

                <p className='paragraph-medium body-color'>
                  {getJoinedDate(mongoUser.joinedAt)}
                </p>
              </div>
            </div>

            {mongoUser?.bio && (
              <p className='paragraph-regular small-color mt-8'>
                {mongoUser.bio}
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {userId === mongoUser.clerkId && (
              <Link href='/profile/edit'>
                <Button className='paragraph-medium  btn-secondary base-color min-h-[46px] min-w-[175px] px-4 py-3'>
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      {/* User Stats */}
      <Stats
        totalQuestions={userStats.totalQuestions}
        totalAnswers={userStats.totalAnswers}
      />

      <div className='mt-10 flex gap-10'>
        <Tabs defaultValue='top-posts' className='flex-1'>
          <TabsList className='tab-shade min-h-[42px] p-1'>
            <TabsTrigger value='top-posts' className='tab'>
              Top Posts
            </TabsTrigger>
            <TabsTrigger value='answers' className='tab'>
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value='top-posts'
            className='mt-5 flex w-full flex-col gap-6'
          >
            {userStats.questions.map((item: any) => (
              <QuestionCard
                key={item._id}
                clerkId={userId}
                _id={item._id}
                title={item.title}
                tags={item.tags}
                author={item.author}
                upvotes={item.upvotes.length}
                views={item.views}
                answers={item.answers}
                createdAt={item.createdAt}
              />
            ))}

            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={userStats.isNextQuestions}
            />
          </TabsContent>
          <TabsContent value='answers' className='flex w-full flex-col gap-6'>
            {userStats.answers.map((item: any) => (
              <AnswerCard
                key={item._id}
                clerkId={userId}
                _id={item._id}
                question={item.question}
                author={item.author}
                upvotes={item.upvotes.length}
                createdAt={item.createdAt}
              />
            ))}

            <Pagination
              pageNumber={searchParams?.page ? +searchParams.page : 1}
              isNext={userStats.isNextAnswers}
            />
          </TabsContent>
        </Tabs>

        <div className='flex min-w-[278px] flex-col max-lg:hidden'>
          <h3 className='h3-bold heading2-color'>Top Tags</h3>

          <div className='mt-7 flex flex-col gap-4'>
            {interactedTags.map((tag) => (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className='flex justify-between gap-2'
              >
                <Badge className='subtle-medium tag-background-shade tag-color rounded-md border-none px-4 py-2 uppercase'>
                  {tag.name}
                </Badge>

                <p className='small-medium body2-color'>
                  {tag.questions.length}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
