"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { toast } from "../ui/use-toast";
import { AnswerSchema } from "@/lib/validations";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const pathname = usePathname();

  const editorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setSubmitting(true);

    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });

      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }

      toast({
        title: "Answer Posted",
        description: "Your answer has been successfully posted.",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const generateAIAnswer = async () => {
    const response = await fetch("http://localhost:3000/api/chatgpt", {
      method: "POST",
      body: JSON.stringify({
        question,
      }),
    });

    const aiAnswer = await response.json();

    // Convert plain text to HTML format
    const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br>");

    if (editorRef.current) {
      const editor = editorRef.current as any;
      editor.setContent(formattedAnswer);
    }

    toast({
      title: "AI Answer Generated",
      description:
        "The AI has successfully generated an answer based on your query.",
    });
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h4 className='paragraph-semibold text-light-800'>
          Write your answer here
        </h4>

        <Button
          className='gap-1.5 rounded-md border border-dark-400 bg-dark-300 px-4 py-2.5 text-primary-500'
          onClick={() => generateAIAnswer()}
        >
          <Image
            src='/assets/icons/stars.svg'
            alt='stars'
            width={12}
            height={12}
            className='object-contain'
          />
          Generate AI answer
        </Button>
      </div>

      <Form {...form}>
        <form
          className='mt-6 flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name='answer'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormControl className='mt-3.5'>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    onEditorChange={(content) => field.onChange(content)}
                    onBlur={field.onBlur}
                    init={{
                      height: 350,
                      menubar: false,
                      skin: "oxide-dark",
                      content_css: "dark",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | blocks | " +
                        "codesample | bold italic forecolor | alignleft aligncenter | " +
                        "alignright alignjustify | bullist numlist",
                      content_style:
                        "body { font-family: Poppins; font-size:16px;}",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit'
              disabled={submitting}
            >
              Post Answer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
