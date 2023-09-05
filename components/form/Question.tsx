"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "../ui/badge";
import { toast } from "../ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { QuestionSchema } from "@/lib/validations";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useTheme } from "@/context/ThemeProvider";

interface Props {
  type?: string;
  mongoUserId: string;
  questionDetails?: string;
}

const Question = ({ type, mongoUserId, questionDetails }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { mode } = useTheme();

  const editorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails as string);
  console.log(parsedQuestionDetails);

  const groupedTags = parsedQuestionDetails?.tags.map((tag: any) => tag.name);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.title || "",
      explanation: parsedQuestionDetails?.content || "",
      tags: groupedTags || [],
    },
  });

  const handleCreateQuestion = async (
    values: z.infer<typeof QuestionSchema>
  ) => {
    setSubmitting(true);

    try {
      if (type === "edit") {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          path: pathname,
        });

        toast({
          title: "Question Edited",
          description: "Your question has been successfully edited.",
        });

        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          title: values.title,
          content: values.explanation,
          tags: values.tags,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });

        toast({
          title: "Question Posted",
          description: "Your question has been successfully posted.",
        });

        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 10) {
          return form.setError("tags", {
            type: "required",
            message: "Tag must not exceed 10 characters.",
          });
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "required",
        message: "At least one tag is required",
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className='flex w-full flex-col gap-10'
          onSubmit={form.handleSubmit(handleCreateQuestion)}
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col'>
                <FormLabel className='paragraph-semibold small-color'>
                  Question Title <span className='text-primary-500'>*</span>
                </FormLabel>
                <FormControl className='mt-3.5'>
                  <Input
                    className='no-focus paragraph-regular input-shade light-border-2 paragraph-color min-h-[56px] border'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Be specific and imagine you’re asking a question to another
                  person.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            key={mode}
            control={form.control}
            name='explanation'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='paragraph-semibold small-color'>
                  Detailed explanation of your problem?
                  <span className='text-primary-500'>*</span>
                </FormLabel>
                <FormControl className='mt-3.5'>
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      // @ts-ignore
                      (editorRef.current = editor)
                    }
                    initialValue={parsedQuestionDetails?.content || ""}
                    onEditorChange={(content) => field.onChange(content)}
                    onBlur={field.onBlur}
                    init={{
                      height: 350,
                      menubar: false,
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
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
                        "body { font-family: Inter; font-size:16px;}",
                    }}
                  />
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='paragraph-semibold small-color'>
                  Tags <span className='text-primary-500'>*</span>
                </FormLabel>
                <FormControl>
                  <>
                    <Input
                      className='no-focus paragraph-regular input-shade light-border-2 paragraph-color min-h-[56px] border'
                      placeholder='Add tags...'
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />

                    {field.value.length > 0 && (
                      <div className='flex-start mt-2.5 gap-2.5'>
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            onClick={() => handleTagRemove(tag, field)}
                            className='subtle-medium tag-background-shade tag-color flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize'
                          >
                            {tag}
                            <Image
                              src='/assets/icons/close.svg'
                              width={12}
                              height={12}
                              alt='close icon'
                              className='cursor-pointer object-contain invert-0 dark:invert'
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Add up to 3 tags to describe what your question is about. You
                  need to press enter to add a tag.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-16 flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit !text-light-900'
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  {type === "edit" ? "Editing..." : "Posting..."}
                </>
              ) : (
                <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Question;
