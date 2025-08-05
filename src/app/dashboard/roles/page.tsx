
"use client";

import { useAtom } from 'jotai';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserRole } from "@/lib/types";
import { pages } from '@/lib/pages';
import type { PageKey, PagePermissions } from '@/lib/permissions';
import { permissionsAtom } from '@/lib/permissions';

const roles: UserRole[] = ["Owner", "RH", "Manager", "Employee", "Dev"];
const actions: (keyof PagePermissions)[] = ['view', 'create', 'edit', 'delete'];

export default function RolesPage() {
    const [permissions, setPermissions] = useAtom(permissionsAtom);

    const handlePermissionChange = (role: UserRole, page: PageKey, action: keyof PagePermissions, checked: boolean) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            if (!newPermissions[role]) newPermissions[role] = {} as any;
            if (!newPermissions[role][page]) newPermissions[role][page] = { view: false };

            const updatedPagePermissions = { ...newPermissions[role][page], [action]: checked };

            // If view is unchecked, all other permissions for that page should be unchecked
            if (action === 'view' && !checked) {
                Object.keys(updatedPagePermissions).forEach(key => {
                    if (key !== 'view') {
                        (updatedPagePermissions as any)[key] = false;
                    }
                });
            }

            return {
                ...prev,
                [role]: {
                    ...prev[role],
                    [page]: updatedPagePermissions
                }
            };
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Role Management</CardTitle>
                <CardDescription>
                    Configure page and action access for different user roles. Changes are saved automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] sticky left-0 bg-background z-10">Role</TableHead>
                                {Object.values(pages).map(pageName => (
                                    <TableHead key={pageName} colSpan={4} className="text-center">{pageName}</TableHead>
                                ))}
                            </TableRow>
                            <TableRow>
                                <TableHead className="sticky left-0 bg-background z-10"></TableHead>
                                {Object.keys(pages).map(pageKey => (
                                    actions.map(action => (
                                        <TableHead key={`${pageKey}-${action}`} className="capitalize">{action}</TableHead>
                                    ))
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role}>
                                    <TableCell className="font-medium sticky left-0 bg-background z-10">{role}</TableCell>
                                    {Object.keys(pages).map(pageKey => {
                                        const pageKeyTyped = pageKey as PageKey;
                                        const pagePerms = permissions[role]?.[pageKeyTyped];
                                        const hasAction = (action: keyof PagePermissions) => pagePerms && action in pagePerms;

                                        return actions.map(action => (
                                            <TableCell key={`${role}-${pageKey}-${action}`}>
                                                {hasAction(action) && (
                                                     <Checkbox
                                                        id={`${role}-${pageKey}-${action}`}
                                                        checked={pagePerms?.[action] ?? false}
                                                        onCheckedChange={(checked) => handlePermissionChange(role, pageKeyTyped, action, !!checked)}
                                                        disabled={action !== 'view' && !pagePerms?.view}
                                                    />
                                                )}
                                            </TableCell>
                                        ));
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
