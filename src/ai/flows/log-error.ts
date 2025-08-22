
'use server';

/**
 * @fileOverview Logs an application error to the database.
 *
 * - logError - A function that logs an error.
 * - LogErrorInput - The input type for the logError function.
 * - LogErrorOutput - The return type for the logError function.
 */

import { ai } from '@/ai/genkit';
import { addError } from '@/lib/firestore';
import { z } from 'genkit';

const LogErrorInputSchema = z.object({
  message: z.string().describe('The error message.'),
  file: z.string().describe('The file where the error occurred.'),
  stackTrace: z.string().describe('The stack trace of the error.'),
  level: z.enum(['error', 'warning', 'info']).describe('The severity level of the error.'),
});
export type LogErrorInput = z.infer<typeof LogErrorInputSchema>;

const LogErrorOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type LogErrorOutput = z.infer<typeof LogErrorOutputSchema>;


export async function logError(input: LogErrorInput): Promise<LogErrorOutput> {
  return logErrorFlow(input);
}

const logErrorFlow = ai.defineFlow(
  {
    name: 'logErrorFlow',
    inputSchema: LogErrorInputSchema,
    outputSchema: LogErrorOutputSchema,
  },
  async (input) => {
    try {
      await addError(input);
      return {
        success: true,
        message: 'Error logged successfully.',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Failed to log error to Firestore:", errorMessage);
      return {
        success: false,
        message: `Failed to log error: ${errorMessage}`,
      };
    }
  }
);
