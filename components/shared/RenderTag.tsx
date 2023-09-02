import Link from "next/link";

import { Badge } from "../ui/badge";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <>
      <Link
        href={`/tags/${_id}`}
        key={_id}
        className='flex justify-between gap-2'
      >
        <Badge className='subtle-medium tag-background-shade tag-color rounded-md border-none px-4 py-2 uppercase'>
          {name}
        </Badge>

        {showCount && (
          <p className='small-medium body2-color'>{totalQuestions}</p>
        )}
      </Link>
    </>
  );
};

export default RenderTag;
