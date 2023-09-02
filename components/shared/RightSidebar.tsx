import Link from "next/link";
import Image from "next/image";

import RenderTag from "./RenderTag";

import { getTopPopularTags } from "@/lib/actions/tag.action";
import { getHotQuestions } from "@/lib/actions/question.action";

const RightSidebar = async () => {
  const hotQuestions = await getHotQuestions();
  const popularTags = await getTopPopularTags();

  return (
    <section className='custom-scrollbar common-background-shade sticky right-0 top-0 flex h-screen w-[330px] flex-col gap-6 overflow-y-auto p-6 pt-36 max-xl:hidden'>
      <div>
        <h3 className='h3-bold heading3-color'>Top Questions</h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className='flex cursor-pointer items-center justify-between gap-7'
            >
              <p className='body-medium body2-color'>{question.title}</p>

              <Image
                src='/assets/icons/chevron-right.svg'
                alt='Chevron right icon'
                width={20}
                height={20}
                className='white-black-invert'
              />
            </Link>
          ))}
        </div>
      </div>

      <div className='mt-16'>
        <h3 className='h3-bold heading3-color'>Popular Tags</h3>
        <div className='mt-7 flex flex-col gap-4'>
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.numberOfQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
