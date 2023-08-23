import { auth, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { getUserById, getUserStats } from "@/lib/actions/user.action";
import { formatNumber, getJoinedDate } from "@/lib/utils";
import AnswerCard from "@/components/cards/AnswerCard";

const Page = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId: params.id });
  if (!mongoUser) return null;

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
      <div className='mt-10'>
        <h4 className='h3-semibold heading2-color'>Stats</h4>

        <div className='mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4'>
          <div className='light-border card-wrapper2 flex flex-wrap items-center justify-evenly gap-11 rounded-md border p-6 shadow-stat-card '>
            <div>
              <p className='paragraph-semibold heading2-color'>
                {formatNumber(userStats.totalQuestions)}
              </p>
              <p className='body-medium body-color'>Questions</p>
            </div>

            <div>
              <p className='paragraph-semibold heading2-color'>
                {formatNumber(userStats.totalAnswers)}
              </p>
              <p className='body-medium body-color'>Answers</p>
            </div>
          </div>

          <div className='light-border card-wrapper2 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-stat-card'>
            <Image
              src='/assets/icons/gold-medal.svg'
              alt='gold medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold heading2-color'>50</p>
              <p className='body-medium body-color'>Gold Badges</p>
            </div>
          </div>

          <div className='light-border card-wrapper2 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-stat-card'>
            <Image
              src='/assets/icons/silver-medal.svg'
              alt='silver medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold heading2-color'>50</p>
              <p className='body-medium body-color'>Silver Badges</p>
            </div>
          </div>

          <div className='light-border card-wrapper2 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-stat-card'>
            <Image
              src='/assets/icons/bronze-medal.svg'
              alt='bronze medal icon'
              width={40}
              height={50}
            />
            <div>
              <p className='paragraph-semibold heading2-color'>80</p>
              <p className='body-medium body-color'>Bronze Badges</p>
            </div>
          </div>
        </div>
      </div>

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
          </TabsContent>
          <TabsContent value='answers' className='flex w-full flex-col gap-6'>
            {userStats.answers.map((item: any) => (
              <AnswerCard
                key={item._id}
                clerkId={userId}
                _id={item._id}
                question={item.question}
                title={item.content}
                author={item.author}
                upvotes={item.upvotes.length}
                createdAt={item.createdAt}
              />
            ))}
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
