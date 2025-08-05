
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

export type Permissions = Record<PageKey, PagePermissions>;

export type RolePermissions = Record<UserRole, Permissions>;

const allPermissions: PagePermissions = { view: true, create: true, edit: true, delete: true };
const readOnlyPermissions: PagePermissions = { view: true, create: false, edit: false, delete: false };
const noAccessPermissions: PagePermissions = { view: false, create: false, edit: false, delete: false };

const initialPermissions: RolePermissions = {
    Owner: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: { view: true, create: true, edit: true, delete: false },
        attendance: allPermissions,
        tickets: { view: true },
        'job-description-generator': { view: true },
        roles: { view: true },
        'seed-database': { view: true },
        profile: { view: true },
    },
    RH: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: { view: true, create: true, edit: true, delete: false },
        attendance: allPermissions,
        tickets: { view: true },
        'job-description-generator': { view: true },
        roles: noAccessPermissions,
        'seed-database': noAccessPermissions,
        profile: { view: true },
    },
    Manager: {
        overview: { view: true },
        employees: { view: true, create: true, edit: true, delete: false },
        candidates: noAccessPermissions,
        departments: noAccessPermissions,
        leaves: { view: true, create: true, edit: true, delete: false },
        attendance: noAccessPermissions,
        tickets: { view: true },
        'job-description-generator': noAccessPermissions,
        roles: noAccessPermissions,
        'seed-database': noAccessPermissions,
        profile: { view: true },
    },
    Employee: {
        overview: { view: true },
        employees: readOnlyPermissions,
        candidates: noAccessPermissions,
        departments: noAccessPermissions,
        leaves: { view: true, create: true, edit: false, delete: false },
        attendance: noAccessPermissions,
        tickets: { view: true },
        'job-description-generator': noAccessPermissions,
        roles: noAccessPermissions,
        'seed-database': noAccessPermissions,
        profile: { view: true },
    },
    Dev: {
        overview: { view: true },
        employees: allPermissions,
        candidates: allPermissions,
        departments: allPermissions,
        leaves: allPermissions,
        attendance: allPermissions,
        tickets: { view: true, create: true, edit: true, delete: true },
        'job-description-generator': { view: true },
        roles: allPermissions,
        'seed-database': { view: true },
        profile: { view: true },
    },
};

export const permissionsAtom = atomWithStorage<RolePermissions>('role_permissions', initialPermissions);

export const pagePermissions = initialPermissions;

