import Pagination from "../shared/Pagination";
import QuestionCard from "../cards/QuestionCard";

import { SearchParamsProps } from "@/types";
import { getUserQuestions } from "@/lib/actions/user.action";

export interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.questions.map((item) => (
        <QuestionCard
          key={item._id}
          clerkId={clerkId}
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
        isNext={result.isNextQuestions}
      />
    </>
  );
};

export default QuestionsTab;
