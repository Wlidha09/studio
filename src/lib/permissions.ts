
"use client";

import type { UserRole } from "./types";
import { atomWithStorage } from 'jotai/utils';
import { pages } from "./pages";

export type PageKey = keyof typeof pages;

export type PagePermissions = {
    view: boolean;
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
};

export type Permissions = Partial<Record<PageKey, PagePermissions>>;

export type RolePermissions = Record<UserRole, Permissions>;

const allPermissions: PagePermissions = { view: true, create: true, edit: true, delete: true };

const initialPermissions: RolePermissions = {
    Owner: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
    RH: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
    Manager: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
    Employee: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
    Dev: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: allPermissions,
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
};

export const permissionsAtom = atomWithStorage<RolePermissions>('role_permissions', initialPermissions);
