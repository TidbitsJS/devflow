import { z } from "zod";

const questionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(130, { message: "Title musn't be longer then 130 characters." }),
  explanation: z.string().min(20, { message: "Minimum of 20 characters." }),
  tags: z
    .string()
    .array()
    .min(1, { message: "Add at least one tag." })
    .max(3, { message: "Maximum of 3 tags." }),
});

export default questionSchema;
