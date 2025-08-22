
"use server";

import { logError } from "@/ai/flows/log-error";
import { updateErrorStatus } from "@/lib/firestore";
import type { ErrorLog } from "@/lib/types";

export async function logErrorAction(errorData: {
    message: string;
    file: string;
    stackTrace: string;
    level: 'error' | 'warning' | 'info';
}) {
    try {
        await logError(errorData);
    } catch (e) {
        console.error("Failed to trigger error logging flow:", e);
    }
}

export async function updateErrorStatusAction(id: string, status: ErrorLog['status']) {
    try {
        await updateErrorStatus(id, status);
        return { success: true, message: "Status updated successfully." };
    } catch (e) {
        console.error("Failed to update error status:", e);
        return { success: false, message: "Failed to update status." };
    }
}
