import Link from "next/link";
import Image from "next/image";
import { auth, SignedIn } from "@clerk/nextjs";

import Stats from "@/components/Profile/Stats";
import { Button } from "@/components/ui/button";
import RenderTag from "@/components/shared/RenderTag";
import AnswersTab from "@/components/Profile/AnswersTab";
import QuestionsTab from "@/components/Profile/QuestionsTab";
import { ProfileLink } from "@/components/Profile/ProfileLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getJoinedDate } from "@/lib/utils";
import { getUserInfo } from "@/lib/actions/user.action";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const userInfo = await getUserInfo({ userId: params.id });
  if (!userInfo.user) return null;

  const interactedTags = await getTopInteractedTags({
    userId: userInfo.user._id,
    limit: 10,
  });

  return (
    <>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          <Image
            src={userInfo.user.picture}
            alt='user avatar'
            width={140}
            height={140}
            className='rounded-full object-cover'
          />

          <div className='mt-3'>
            <h2 className='h2-bold heading1-color'>{userInfo.user.name}</h2>
            <p className='paragraph-regular text-dl-28'>
              @{userInfo.user.username}
            </p>

            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl='/assets/icons/link.svg'
                  href={userInfo.user.portfolioWebsite}
                  title='Portfolio'
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  imgUrl='/assets/icons/location.svg'
                  title={userInfo.user.location}
                />
              )}

              <ProfileLink
                imgUrl='/assets/icons/calendar.svg'
                title={getJoinedDate(userInfo.user.joinedAt)}
              />
            </div>

            {userInfo.user?.bio && (
              <p className='paragraph-regular small-color mt-8'>
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>

        <div className='flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3'>
          <SignedIn>
            {userId === userInfo.user.clerkId && (
              <Link href='/profile/edit'>
                <Button className='paragraph-medium  btn-secondary base-color min-h-[46px] min-w-[175px] px-4 py-3'>
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>

      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
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
            {/* @ts-ignore */}
            <QuestionsTab
              searchParams={searchParams}
              userId={userInfo.user._id}
            />
          </TabsContent>

          <TabsContent value='answers' className='flex w-full flex-col gap-6'>
            {/* @ts-ignore */}
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo.user._id}
            />
          </TabsContent>
        </Tabs>

        <div className='flex min-w-[278px] flex-col max-lg:hidden'>
          <h3 className='h3-bold heading2-color'>Top Tags</h3>

          <div className='mt-7 flex flex-col gap-4'>
            {interactedTags.map((tag) => (
              <RenderTag
                key={tag._id}
                _id={tag._id}
                name={tag.name}
                totalQuestions={tag.questions.length}
                showCount
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
