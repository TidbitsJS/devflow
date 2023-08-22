import QuestionCard from "@/components/cards/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { getUserById, getUserStats } from "@/lib/actions/user.action";
import { formatNumber, getJoinedDate } from "@/lib/utils";
import { auth, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Page = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId: params.id });
  const interactedTags = await getTopInteractedTags({
    userId: mongoUser._id,
    limit: 10,
  });

  const userStats = await getUserStats({ userId: mongoUser._id });

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
            <h2 className='h2-bold text-white'>{mongoUser.name}</h2>
            <p className='paragraph-regular text-light-800'>
              @{mongoUser.username}
            </p>

            <div className='mt-5 flex flex-wrap items-start gap-5'>
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
                    💼 Portfolio
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

                  <p className='paragraph-medium text-light-700'>
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

                <p className='paragraph-medium text-light-700'>
                  {getJoinedDate(mongoUser.createdAt)}
                </p>
              </div>
            </div>

            {mongoUser?.bio && (
              <p className='paragraph-regular mt-8 text-light-800'>
                {mongoUser.bio}
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {userId === mongoUser.clerkId && (
              <Link href='/profile/edit'>
                <Button className='paragraph-medium  min-h-[46px] min-w-[175px] bg-dark-400 px-4 py-3 text-white'>
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      {/* User Stats */}
      <div className='mt-10'>
        <h4 className='h3-semibold text-white'>Stats</h4>

        <div className='mt-5 flex flex-wrap gap-5'>
          <div className='flex min-w-full flex-1 items-center justify-evenly gap-11 rounded-md border border-dark-300 bg-dark-200 p-6 shadow-stat-card xs:min-w-[250px]'>
            <div>
              <p className='paragraph-semibold text-white'>
                {formatNumber(userStats.totalQuestions)}
              </p>
              <p className='body-medium text-light-700'>Questions</p>
            </div>

            <div>
              <p className='paragraph-semibold text-white'>
                {formatNumber(userStats.totalAnswers)}
              </p>
              <p className='body-medium text-light-700'>Answers</p>
            </div>
          </div>

          <div className='flex-start min-w-full flex-1 flex-wrap gap-4 rounded-md border border-dark-300 bg-dark-300 p-6 shadow-stat-card xs:min-w-[250px]'>
            <Image
              src='/assets/icons/gold-medal.svg'
              alt='gold medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold text-white'>50</p>
              <p className='body-medium text-light-700'>Gold Badges</p>
            </div>
          </div>

          <div className='flex-start min-w-full flex-1 flex-wrap gap-4 rounded-md border border-dark-300 bg-dark-300 p-6 shadow-stat-card xs:min-w-[250px]'>
            <Image
              src='/assets/icons/silver-medal.svg'
              alt='silver medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold text-white'>50</p>
              <p className='body-medium text-light-700'>Silver Badges</p>
            </div>
          </div>

          <div className='flex-start min-w-full flex-1 flex-wrap gap-4 rounded-md border border-dark-300 bg-dark-300 p-6 shadow-stat-card xs:min-w-[250px]'>
            <Image
              src='/assets/icons/bronze-medal.svg'
              alt='bronze medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold text-white'>80</p>
              <p className='body-medium text-light-700'>Bronze Badges</p>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-10 flex gap-10'>
        <Tabs defaultValue='top-posts' className='flex-1'>
          <TabsList className='min-h-[42px] bg-dark-400 p-1'>
            <TabsTrigger
              value='top-posts'
              className='min-h-full bg-dark-400 text-light-500 data-[state=active]:bg-dark-300 data-[state=active]:text-primary-500'
            >
              Top Posts
            </TabsTrigger>
            <TabsTrigger
              value='answers'
              className='min-h-full bg-dark-400 text-light-500 data-[state=active]:bg-dark-300 data-[state=active]:text-primary-500'
            >
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
          </TabsContent>
          <TabsContent value='answers' className='mt-5'>
            Change your password here.
          </TabsContent>
        </Tabs>

        <div className='flex min-w-[278px] flex-col max-lg:hidden'>
          <h3 className='h3-bold text-white'>Top Tags</h3>

          <div className='mt-7 flex flex-col gap-4'>
            {interactedTags.map((tag) => (
              <Link
                href={`/tags/${tag._id}`}
                key={tag._id}
                className='flex justify-between gap-2'
              >
                <Badge className='subtle-medium rounded-md bg-dark-300 px-4 py-2 uppercase text-light-500'>
                  {tag.name}
                </Badge>

                <p className='small-medium text-light-700'>
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
