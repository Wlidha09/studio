
"use client";

import { useAtom } from 'jotai';
import { permissionsAtom, type PageKey, type Action } from '@/lib/permissions';
import { useRole } from '@/contexts/role-context';
import { useCallback } from 'react';

export function usePermissions() {
    const [permissions, setPermissions] = useAtom(permissionsAtom);
    const { role } = useRole();

    const hasPermission = useCallback((page: PageKey, action: Action): boolean => {
        return permissions[role]?.[page]?.[action] ?? false;
    }, [permissions, role]);

    const setPermission = (roleName: string, page: PageKey, action: Action, value: boolean) => {
        setPermissions(prev => {
            const newPermissions = JSON.parse(JSON.stringify(prev)); // Deep copy

            if (!newPermissions[roleName]) {
                newPermissions[roleName] = {};
            }
            if (!newPermissions[roleName][page]) {
                newPermissions[roleName][page] = { view: false, create: false, edit: false, delete: false };
            }
            
            const pagePermissions = newPermissions[roleName][page];
            if(pagePermissions) {
                 pagePermissions[action] = value;
            }

            // If view is turned off, turn off all others
            if (action === 'view' && !value) {
                if (pagePermissions) {
                    pagePermissions.create = false;
                    pagePermissions.edit = false;
                    pagePermissions.delete = false;
                }
            }

            // If any other permission is turned on, turn on view
            if (action !== 'view' && value) {
                if (pagePermissions) {
                    pagePermissions.view = true;
                }
            }
            
            return newPermissions;
        });
    };
    
    return { permissions, setPermission, hasPermission };
}
