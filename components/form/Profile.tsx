"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { ProfileSchema } from "@/lib/validations";
import { updateUser } from "@/lib/actions/user.action";

interface Params {
  clerkId: string;
  user: string;
}

const Profile = ({ clerkId, user }: Params) => {
  const parsedUser = JSON.parse(user);
  const router = useRouter();
  const pathname = usePathname();

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || "",
      username: parsedUser.username || "",
      portfolioWebsite: parsedUser.portfolioWebsite || "",
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
    },
  });

  const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
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
        path: pathname,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });

      router.back();
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
              <FormLabel className='paragraph-semibold small-color'>
                Name <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular light-border-2 input-shade paragraph-color min-h-[56px] border'
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
              <FormLabel className='paragraph-semibold small-color'>
                Username <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular light-border-2 input-shade paragraph-color min-h-[56px] border'
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
              <FormLabel className='paragraph-semibold small-color'>
                Portfolio Link
              </FormLabel>
              <FormControl>
                <Input
                  type='url'
                  className='no-focus paragraph-regular light-border-2 input-shade paragraph-color min-h-[56px] border'
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
              <FormLabel className='paragraph-semibold small-color'>
                Location <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='no-focus paragraph-regular light-border-2 input-shade paragraph-color min-h-[56px] border'
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
              <FormLabel className='paragraph-semibold small-color'>
                Bio <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className='no-focus paragraph-regular light-border-2 input-shade paragraph-color min-h-[56px] border'
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
            {submitting ? (
              <>
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
