

"use client";

import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { pages } from "./pages";

export type PageKey = keyof typeof pages;
export type Action = 'view' | 'create' | 'edit' | 'delete';

export type PagePermissions = {
    view: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
};

export type Permissions = Partial<Record<PageKey, PagePermissions>>;

export type RolePermissions = Record<string, Permissions>;

const allPermissions: PagePermissions = { view: true, create: true, edit: true, delete: true };
const viewOnly: PagePermissions = { view: true, create: false, edit: false, delete: false };
const noAccess: PagePermissions = { view: false, create: false, edit: false, delete: false };

const initialPermissions: RolePermissions = {
    Owner: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        schedule: allPermissions,
        'job-description-generator': { view: true },
        'send-schedule-reminders': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
        errors: noAccess,
    },
    RH: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        schedule: { view: true, create: true },
        'job-description-generator': { view: true },
        'send-schedule-reminders': { view: true },
        roles: { view: false },
        'seed-database': { view: false },
        profile: { view: true },
        errors: noAccess,
    },
    Manager: {
        overview: { view: true },
        employees: { view: true },
        candidates: { view: true, create: true, edit: true },
        departments: viewOnly,
        leaves: { view: true, create: true, edit: true },
        attendance: viewOnly,
        tickets: { view: true },
        schedule: { view: true, create: true },
        'job-description-generator': { view: true },
        'send-schedule-reminders': { view: false },
        roles: { view: false },
        'seed-database': { view: false },
        profile: { view: true },
        errors: noAccess,
    },
    Employee: {
        overview: { view: true },
        employees: { view: true },
        candidates: { view: false },
        departments: { view: false },
        leaves: { view: true, create: true },
        attendance: { view: true },
        tickets: { view: true },
        schedule: { view: true, create: true },
        'job-description-generator': { view: false },
        'send-schedule-reminders': { view: false },
        roles: { view: false },
        'seed-database': { view: false },
        profile: { view: true },
        errors: noAccess,
    },
    Dev: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        schedule: allPermissions,
        'job-description-generator': allPermissions,
        'send-schedule-reminders': allPermissions,
        roles: allPermissions,
        'seed-database': allPermissions,
        profile: { view: true },
        errors: allPermissions,
    },
};

const storage = createJSONStorage(() => localStorage);
export const permissionsAtom = atomWithStorage<RolePermissions>('role_permissions', initialPermissions, storage);
