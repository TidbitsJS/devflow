"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteQuestion } from "@/lib/actions/question.action";
import { toast } from "../ui/use-toast";
import { deleteAnswer } from "@/lib/actions/answer.action";

interface Props {
  type: string;
  itemId: string;
}

const EditDeleteAction = ({ type, itemId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleEdit = async () => {
    if (type === "Question") {
      router.push(`/question/edit/${itemId}`);
    } else if (type === "Answer") {
      // do something
    }
  };

  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: JSON.parse(itemId), path: pathname });

      toast({
        title: "Question Deleted",
        variant: "destructive",
        description: "Your question has been successfully deleted.",
      });
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: JSON.parse(itemId), path: pathname });

      toast({
        title: "Answer Deleted",
        description: "Your answer has been successfully deleted.",
      });
    }
  };

  return (
    <div className='flex items-center justify-end gap-3 max-sm:w-full'>
      <Image
        src='/assets/icons/edit.svg'
        alt='edit'
        width={14}
        height={14}
        className='cursor-pointer object-contain'
        onClick={handleEdit}
      />
      <Image
        src='/assets/icons/trash.svg'
        alt='trash'
        width={14}
        height={14}
        className='cursor-pointer object-contain'
        onClick={handleDelete}
      />
    </div>
  );
};

export default EditDeleteAction;
