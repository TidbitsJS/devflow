import { z } from "zod";

const answerSchema = z.object({
  answer: z.string().min(20, { message: "Minimum of 20 characters." }),
});

export default answerSchema;
