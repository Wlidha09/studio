import { config } from 'dotenv';
config();

import '@/ai/flows/generate-job-description.ts';
import '@/ai/flows/import-holidays.ts';
import '@/ai/flows/send-schedule-reminders.ts';
