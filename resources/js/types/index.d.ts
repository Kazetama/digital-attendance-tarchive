import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

interface Student {
    id: number;
    uid_card: string;
    name: string;
    email: string;
    class: string;
    major: string;
    parent_phone: string;
    address: string;
    image?: string;
    is_active: boolean;
}

interface Group {
    major: string;
    class: string;
}

interface StudentLog {
    id: number;
    name: string;
    class: string;
    major: string;
    status: string;
    type: string | null;
    scanned_at: string | null;
}
