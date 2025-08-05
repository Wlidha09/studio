
"use client";

import type { UserRole } from "./types";
import { atomWithStorage } from 'jotai/utils';
import { pages } from "./pages";

export type PageKey = keyof typeof pages;
export type Permissions = Record<PageKey, boolean>;
type RolePermissions = Record<UserRole, Permissions>;

const initialPermissions: RolePermissions = {
    Owner: {
        overview: true,
        employees: true,
        candidates: true,
        departments: true,
        leaves: true,
        attendance: true,
        tickets: true,
        'job-description-generator': true,
        roles: true,
        'seed-database': true,
        profile: true,
    },
    RH: {
        overview: true,
        employees: true,
        candidates: true,
        departments: true,
        leaves: true,
        attendance: true,
        tickets: true,
        'job-description-generator': true,
        roles: false,
        'seed-database': false,
        profile: true,
    },
    Manager: {
        overview: true,
        employees: true,
        candidates: false,
        departments: false,
        leaves: true,
        attendance: false,
        tickets: true,
        'job-description-generator': false,
        roles: false,
        'seed-database': false,
        profile: true,
    },
    Employee: {
        overview: true,
        employees: false,
        candidates: false,
        departments: false,
        leaves: true,
        attendance: false,
        tickets: true,
        'job-description-generator': false,
        roles: false,
        'seed-database': false,
        profile: true,
    },
    Dev: {
        overview: true,
        employees: true,
        candidates: true,
        departments: true,
        leaves: true,
        attendance: true,
        tickets: true,
        'job-description-generator': true,
        roles: true,
        'seed-database': true,
        profile: true,
    },
};

export const permissionsAtom = atomWithStorage<RolePermissions>('role_permissions', initialPermissions);

export const pagePermissions = initialPermissions;
