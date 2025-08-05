'use server';

/**
 * @fileOverview Imports holidays for a given year.
 *
 * - importHolidays - A function that imports holidays.
 * - ImportHolidaysInput - The input type for the importHolidays function.
 * - ImportHolidaysOutput - The return type for the importHolidays function.
 */

import { ai } from '@/ai/genkit';
import { addHolidays } from '@/lib/firestore';
import { z } from 'genkit';

const HolidaySchema = z.object({
  name: z.string().describe('The name of the holiday.'),
  date: z.string().describe('The date of the holiday in YYYY-MM-DD format.'),
});

const ImportHolidaysInputSchema = z.object({
  year: z.number().describe('The year to import holidays for.'),
});
export type ImportHolidaysInput = z.infer<typeof ImportHolidaysInputSchema>;

const ImportHolidaysOutputSchema = z.object({
  holidays: z.array(HolidaySchema).describe('The list of imported holidays.'),
});
export type ImportHolidaysOutput = z.infer<typeof ImportHolidaysOutputSchema>;

export async function importHolidays(input: ImportHolidaysInput): Promise<ImportHolidaysOutput> {
  const result = await importHolidaysFlow(input);
  if (result.holidays.length > 0) {
    const holidaysToSave = result.holidays.map(h => ({ ...h, paid: true }));
    await addHolidays(holidaysToSave, input.year);
  }
  return result;
}

const prompt = ai.definePrompt({
  name: 'importHolidaysPrompt',
  input: { schema: ImportHolidaysInputSchema },
  output: { schema: ImportHolidaysOutputSchema },
  prompt: `You are an expert on global holidays. Provide a list of all official public holidays in Tunisia for the year {{{year}}}.
    Please provide the exact date for each holiday. If a holiday spans multiple days (e.g., Eid al-Fitr, Eid al-Adha), please create a separate entry for each day. For example, if Eid al-Fitr is 2 days, you should return "Eid al-Fitr (Day 1)" and "Eid al-Fitr (Day 2)" with their respective dates.
    For religious holidays, please provide the most commonly accepted dates for {{{year}}}.
    `,
});

const importHolidaysFlow = ai.defineFlow(
  {
    name: 'importHolidaysFlow',
    inputSchema: ImportHolidaysInputSchema,
    outputSchema: ImportHolidaysOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
