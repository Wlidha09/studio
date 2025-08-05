
"use client";

import { useAtom } from 'jotai';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/lib/types";
import { pages } from '@/lib/pages';
import type { PageKey } from '@/lib/permissions';
import { permissionsAtom } from '@/lib/permissions';

const roles: UserRole[] = ["Owner", "RH", "Manager", "Employee", "Dev"];

export default function RolesPage() {
    const [permissions, setPermissions] = useAtom(permissionsAtom);

    const handlePermissionChange = (role: UserRole, page: PageKey, checked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [page]: checked
            }
        }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Role Management</CardTitle>
                <CardDescription>
                    Configure page access for different user roles. Changes are saved automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Role</TableHead>
                                {Object.values(pages).map(pageName => (
                                    <TableHead key={pageName}>{pageName}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.map(role => (
                                <TableRow key={role}>
                                    <TableCell className="font-medium">{role}</TableCell>
                                    {Object.keys(pages).map(pageKey => (
                                        <TableCell key={`${role}-${pageKey}`}>
                                            <Checkbox
                                                id={`${role}-${pageKey}`}
                                                checked={permissions[role]?.[pageKey as PageKey] ?? false}
                                                onCheckedChange={(checked) => handlePermissionChange(role, pageKey as PageKey, !!checked)}
                                            />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
