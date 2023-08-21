"use client";

import * as z from "zod";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { createQuestion } from "@/lib/actions/question.action";
import { toast } from "../ui/use-toast";
import { QuestionSchema } from "@/lib/validations";

interface Props {
  mongoUserId: string;
}

const Question = ({ mongoUserId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const editorRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  const handleCreateQuestion = async (
    values: z.infer<typeof QuestionSchema>
  ) => {
    setSubmitting(true);

    try {
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
                <FormLabel className='paragraph-semibold text-light-800'>
                  Question Title <span className='text-primary-500'>*</span>
                </FormLabel>
                <FormControl className='mt-3.5'>
                  <Input
                    className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
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
            control={form.control}
            name='explanation'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='paragraph-semibold text-light-800'>
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
                <FormLabel className='paragraph-semibold text-light-800'>
                  Tags <span className='text-primary-500'>*</span>
                </FormLabel>
                <FormControl>
                  <>
                    <Input
                      className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                      placeholder='Add tags...'
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                    />

                    {field.value.length > 0 && (
                      <div className='flex-start mt-2.5 gap-2.5'>
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            onClick={() => handleTagRemove(tag, field)}
                            className='subtle-medium flex items-center justify-center gap-2 rounded-md px-4 py-2 capitalize'
                          >
                            {tag}
                            <Image
                              src='/assets/icons/close.svg'
                              width={12}
                              height={12}
                              alt='close icon'
                              className='cursor-pointer object-contain invert'
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className='body-regular mt-2.5 text-light-500'>
                  Add up to 5 tags to describe what your question is about.
                  Start typing to see suggestions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-16 flex justify-end'>
            <Button
              type='submit'
              className='primary-gradient w-fit'
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                  Posting...
                </>
              ) : (
                <>Ask a Question</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Question;
