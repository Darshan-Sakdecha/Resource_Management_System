export const ROLES = {
    USER: "User",
    MANAGER: "Manager",
    ADMIN: "Admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isValidRole(role: string): role is Role {
    return Object.values(ROLES).includes(role as Role);
}