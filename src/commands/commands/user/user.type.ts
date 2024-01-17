export enum UserRoles {
    "default",
    "admin"
}

export type User = {
    id: number,
    username: string,
    role: UserRoles
}