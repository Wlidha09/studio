"use server";

import { generateJobDescription, type GenerateJobDescriptionInput } from "@/ai/flows/generate-job-description";
import { z } from "zod";

const schema = z.object({
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
});

export async function generateDescriptionAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    department: formData.get("department"),
    role: formData.get("role"),
    responsibilities: formData.get("responsibilities"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generateJobDescription(validatedFields.data as GenerateJobDescriptionInput);
    return {
        message: "success",
        jobDescription: result.jobDescription
    };
  } catch (error) {
    console.error("Error generating job description:", error);
    return {
      message: "Failed to generate job description. Please try again.",
      jobDescription: null,
    };
  }
}
