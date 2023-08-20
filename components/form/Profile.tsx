"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import profileSchema from "@/lib/validations/profile.validate";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/lib/actions/user.action";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Params {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Params) => {
  const parsedUser = JSON.parse(user);
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const handleUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    console.log("coming here");

    setSubmitting(true);
    try {
      await updateUser({
        clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioWebsite: values.portfolioWebsite,
          location: values.location,
          bio: values.bio,
        },
      });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

      router.push("/");
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className='mt-9 flex w-full flex-col gap-9'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='space-y-3.5'>
              <FormLabel className='paragraph-semibold text-light-800'>
                Name <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                  placeholder='Your Name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='space-y-3.5'>
              <FormLabel className='paragraph-semibold text-light-800'>
                Username <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                  placeholder='Your username'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='portfolioWebsite'
          render={({ field }) => (
            <FormItem className='space-y-3.5'>
              <FormLabel className='paragraph-semibold text-light-800'>
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type='url'
                  className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                  placeholder='Your Portfolio link'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem className='space-y-3.5'>
              <FormLabel className='paragraph-semibold text-light-800'>
                Location <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                  placeholder='Where do you live?'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='space-y-3.5'>
              <FormLabel className='paragraph-semibold text-light-800'>
                Bio <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className='no-focus paragraph-regular min-h-[56px] border border-dark-400 bg-dark-300 text-light-700'
                  placeholder="What's special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='mt-7 flex justify-end'>
          <Button
            type='submit'
            className='primary-gradient w-fit'
            disabled={submitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
